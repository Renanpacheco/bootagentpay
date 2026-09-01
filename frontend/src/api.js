import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});


export async function login(userId, senha) {
    const response = await api.post('/api/login', { userId, senha });
    return response.data;
}


export async function enviarMensagemChat(history) {
    const token = localStorage.getItem('token');

    const response = await api.post(
        '/api/chat',
        { history },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data; 
}