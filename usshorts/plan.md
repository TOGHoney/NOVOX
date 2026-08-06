# Debate Rooms — Implementation Plan

## Goal
Replace the mock `Debates` page with real auth-protected **voice debate rooms**. Hosts create rooms; users join; **only one user speaks at a time** (server-enforced floor control); each participant gets **3 minutes total speaking time per session** (server-tracked and revoked).

Signed-in users must **not** be asked to log in again — the session persists from `localStorage` (JWT) and is reused for room APIs and the socket handshake.

## Tech Stack
**Existing:** React 18 + Vite 5, React Router 7, axios, react-icons / Express 5, Mongoose 9 + MongoDB, JWT auth (jsonwebtoken, bcryptjs), Gemini (already wired).

**New:**
- `socket.io` (backend) + `socket.io-client` (frontend) — signaling, presence, floor control, budget timers
- **WebRTC** (browser native, no lib) — audio-only voice
- STUN: `stun:stun.l.google.com:19302`; TURN (coturn) optional for cross-network rooms

## 1. Backend

### Session / Auth middleware
`backend/middleware/authMiddleware.js` — verifies `Authorization: Bearer <jwt>`, attaches `req.user`. Used by every `/api/debates` route and the socket handshake. (No middleware exists today.)

### Model — `backend/models/DebateRoom.js`
```
host: ObjectId ref User
topic, prompt, language, level, maxParticipants
status: open | active | closed
participants: [{ user: ref User, joinedAt, speakingMs: 0 }]
floor: { userId, grantedAt } | null
```

### REST routes — `backend/routes/debateRoutes.js` → `controllers/debateController.js` (all protected)

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/debates` | List open rooms (+ participant counts) |
| POST | `/api/debates` | Host creates a room |
| GET | `/api/debates/:id` | Room details |
| POST | `/api/debates/:id/join` | Add user as participant (cap `maxParticipants`) |
| POST | `/api/debates/:id/leave` | Remove participant |

### Socket service — `backend/services/socketService.js`
Refactor `server.js` to `http.createServer(app)` and pass the server to Socket.IO.
- Handshake auth via JWT in connection query
- Events: `room:join`, `room:leave`, `request-floor`, `release-floor`, `floor-granted`, `floor-revoked`, `budget-update`, `participants`, `room:closed`

### 3-minute speaking budget (server-enforced)
- `speakingMs` persists on the room doc (per user per session)
- On `request-floor`: grant only if no current floor AND `speakingMs < 180000ms`
- While speaking, server ticks `speakingMs`, broadcasts `budget-update` every 5s
- Floor auto-revoked when budget exhausted or on `release-floor`; next queued requester promoted

## 2. Frontend

### Session persistence (no re-login)
1. `src/api/authService.js` — add `getUser()` / `getToken()` helpers reading `localStorage.user`, and a `logout()` that clears it.
2. `src/App.jsx:18` — initialize `view` from persisted session: `useState(() => (getUser() ? 'dashboard' : 'signup'))`. Refresh on a signed-in user goes straight to the app.
3. `src/api/client.js` — small Axios instance with a request interceptor that auto-attaches the Bearer token to every request (reused by `debateService`).
4. Socket.IO handshake passes the same token from localStorage — **no login screen when joining a room**.
5. On any `401` (token expired/invalid): clear localStorage, route to login. Otherwise the session persists.

### API layer
- `src/api/debateService.js` (axios via `client.js`, matches existing service pattern)
- `src/api/socket.js` (socket.io-client wrapper)

### Rewrite `src/pages/Debates.jsx`
- Room list loaded from `GET /api/debates` (topic, host, language/level, `x/max` participants, Join button)
- "Host a Room" form/modal → `POST /api/debates`
- Empty state when no rooms

### New page `src/pages/DebateRoom.jsx` (route `/debates/:id` in `App.jsx`)
- Connect socket; render room topic, participant list with per-user budget bars (`0:00 / 3:00`)
- **"Request to Speak"** button (disabled when budget used or floor busy); grant → mic on + countdown timer
- WebRTC mesh: only floor holder's audio unmuted; everyone else listeners
- Leave/close; error + reconnection states

### WebRTC flow (floor-controlled mesh)
1. `floor-granted` (you) → `getUserMedia(audio)` → create `RTCPeerConnection` to each participant → offer/answer over socket; everyone attaches the speaker's audio stream to a hidden `<audio>`
2. `floor-revoked` (any reason) → stop tracks, tear down connections
3. New joiner mid-speech → server tells speaker to connect audio to newcomer

## 3. Build order
1. Auth middleware + DebateRoom model + REST routes → verify with curl/Postman
2. Socket floor-control + budget logic → verify with 2 browser tabs
3. Refactor `server.js` for Socket.IO
4. Session persistence (authService helpers, `client.js`, App.jsx init)
5. Frontend service + Debates page rewrite (list + create)
6. DebateRoom page + WebRTC voice + floor/budget UI
7. Polish: empty states, duplicate-join guard, room close on host leave

## Risks / Mitigations
- **NAT/firewall audio drop** → add TURN server; fallback: "connectivity poor" + retry
- **Browser autoplay policy** → audio starts from the "Request to Speak" click gesture (granted anyway)
- **Token expiry mid-room** → socket disconnect + redirect to login
- **Budget bypass by client** → enforcement is server-side (budget + floor); client mute is cooperative only
