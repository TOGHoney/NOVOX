import { io } from 'socket.io-client';
import { getToken } from './authService';

const socket = io({
    autoConnect: false,
    auth: (cb) => cb({ token: getToken() })
});

export default socket;
