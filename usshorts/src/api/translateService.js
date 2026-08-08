import axios from 'axios';

const translateClient = axios.create({ baseURL: '/api/translate' });

export const translateTexts = async (texts, target) => {
    const response = await translateClient.post('/', { texts, target });
    return response.data.translations;
};

export const translateText = async (text, target) => {
    const translations = await translateTexts([text], target);
    return translations[0] ?? '';
};
