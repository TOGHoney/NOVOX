import axios from 'axios';
import { getToken, logout } from './authService';

const client = axios.create({ baseURL: '/api' });

client.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            logout();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default client;
