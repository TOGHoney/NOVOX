import axios from 'axios';

const authClient = axios.create({ baseURL: '/api/auth' });

export const signup = async (userData) => {
    const response = await authClient.post('/signup', userData);
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

export const login = async (userData) => {
    const response = await authClient.post('/login', userData);
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

export const getUser = () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

export const getToken = () => {
    return getUser()?.token || null;
};

export const getUserId = () => {
    return getUser()?._id || null;
};

export const logout = () => {
    localStorage.removeItem('user');
};
