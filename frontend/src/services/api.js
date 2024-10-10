import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getLatestStatus = () => {
    return axios.get(`${API_BASE_URL}/device/status`);
};

export const getStatusHistory = () => {
    return axios.get(`${API_BASE_URL}/device/status/history`);
};

export const getUserLogs = () => {
    return axios.get(`${API_BASE_URL}/device/logs`);
};

export const sendControl = (direction) => {
    return axios.post(`${API_BASE_URL}/control/move`, { direction });
};

