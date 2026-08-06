import client from './client';

export const fetchRooms = async () => {
    const response = await client.get('/debates');
    return response.data;
};

export const createRoom = async (roomData) => {
    const response = await client.post('/debates', roomData);
    return response.data;
};

export const fetchRoom = async (roomId) => {
    const response = await client.get(`/debates/${roomId}`);
    return response.data;
};

export const joinRoom = async (roomId) => {
    const response = await client.post(`/debates/${roomId}/join`);
    return response.data;
};

export const leaveRoom = async (roomId) => {
    const response = await client.post(`/debates/${roomId}/leave`);
    return response.data;
};
