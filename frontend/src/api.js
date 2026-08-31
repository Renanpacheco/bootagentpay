import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// 1. Login aceitando userId e senha
export async function login(userId, senha) {
    const response = await api.post('/api/login', { userId, senha });
    return response.data; // Retorna direto o objeto { mensagem, token, usuario }
}

// 2. Função com o nome esperado pelo Chat.jsx
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
    return response.data; // Retorna direto { resposta, historico }
}