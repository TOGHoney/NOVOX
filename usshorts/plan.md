# LinguaBrief — LibreTranslate Integration

Self-hosted LibreTranslate so news articles can be translated into a chosen language (English, Spanish, French, German, Japanese).

## Why self-hosted
- Free, unlimited, private (no per-day quotas like the hosted libretranslate.com API).
- Runs locally on port **5002** during development.
- Production: run it on the **same cloud server as the Express backend** and point `LIBRETRANSLATE_URL` at it (e.g. `http://127.0.0.1:5002`). Netlify alone can't run it — Netlify only hosts static files.

## Status

### Done
1. **LibreTranslate installed** in Python venv at `usshorts/.libretranslate/` (verified working on Python 3.14). `pip install libretranslate` (v1.9.6).
2. **npm scripts** in `usshorts/package.json`:
   - `lt:install` — create venv + install libretranslate
   - `lt:start` — run server on `127.0.0.1:5002 --load-only en,es,fr,de,ja`
3. **`.gitignore`** — added `.libretranslate/`.
4. **Backend** (`backend/`):
   - `services/libreTranslateService.js` — proxies to `LIBRETRANSLATE_URL/translate` via native `fetch`, batch `texts[]`, per-text in-memory cache (1h TTL), preserves input order, 120s timeout.
   - `controllers/translateController.js` — validates `{ texts, target }`, whitelists `en,es,fr,de,ja`, returns `503` when the service is down.
   - `routes/translateRoutes.js` — `POST /api/translate`.
   - `app.js` — mounted at `/api/translate`.
   - `.env` + `example.env` — added `LIBRETRANSLATE_URL=http://localhost:5002`.
5. **Frontend** (`src/`):
   - `api/translateService.js` — `translateTexts(texts, target)`.
   - `context/LanguageContext.jsx` — `targetLanguage` state + `LANGUAGES` list + provider/hook.
   - `components/LanguageSelector.jsx` — dropdown (EN/ES/FR/DE/JA), replaces the globe icon in `Header.jsx`.
   - `hooks/useArticleTranslation.js` — batch-translates `title`, `description`, `aiSummary`, `content` per article; exposes `translations`, `loading`, `unavailable`.
   - Wired into `Home.jsx`, `Articles.jsx`, `Explore.jsx` (+ `NewsCard.jsx` and `ArticlePanel.jsx` with per-card "Show original" toggle; graceful fallback to original text when the service is down).
   - `styles/global.css` — `.language-select` styles.
6. **LibreTranslate server** running on `127.0.0.1:5002` (verified `/languages` responds).

### In progress / Left
- [ ] **Language models download (currently running).** Only `en→fr` has fully installed so far; `en→es`, `en→de`, `en→ja` downloads were flaky (connection resets to `raw.githubusercontent.com`). Verify all 4 models are installed in `~/.local/share/argos-translate/packages/`.
- [ ] End-to-end test: `POST http://127.0.0.1:5002/translate` for `es`/`de`/`ja`.
- [ ] Test backend proxy: `POST http://localhost:5000/api/translate` (needs backend + LibreTranslate running).
- [ ] Test UI: `npm run dev`, pick a language in the header, confirm articles translate and the "Show original" toggle works.
- [ ] Test offline fallback: with LibreTranslate stopped, confirm pages show original text + "Translation service unavailable" note.

## How to run (dev)
```
npm run lt:install   # once
npm run lt:start     # terminal 1 — LibreTranslate on :5002
npm run dev          # terminal 2 — Vite + Express backend
```

## Deployment note
On the server hosting the backend: install libretranslate, run it on `127.0.0.1:5002`, set `LIBRETRANSLATE_URL=http://127.0.0.1:5002`. Do NOT rely on a local copy on the developer laptop.
