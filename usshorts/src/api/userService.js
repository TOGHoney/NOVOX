import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

const getToken = () => {
    return JSON.parse(localStorage.getItem("user"))?.token;
};

export const getProfile = async () => {
    const response = await axios.get(`${API_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return response.data;
};

export const updateProfile = async (profileData) => {
    const response = await axios.put(
        `${API_URL}/profile`,
        profileData,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    );

    return response.data;
};