import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export function login(username, password) {
    return api.post('/auth/login', { username, password });
}

export function sendChat(token, historico) {
    return api.post('/chat', { historico }, {
        headers: { Authorization: `Bearer ${token}` },
    });
}