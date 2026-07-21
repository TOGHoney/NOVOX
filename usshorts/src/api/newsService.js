import axios from 'axios';

const API_URL = '/api/news';

export const fetchHeadlines = async (category = 'general') => {
    const response = await axios.get(`${API_URL}/headlines`, {
        params: { category },
    });
    return response.data;
};

export const searchNews = async (query) => {
    const response = await axios.get(`${API_URL}/search`, {
        params: { q: query },
    });
    return response.data;
};
