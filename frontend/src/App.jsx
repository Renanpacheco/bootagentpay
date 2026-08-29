import { useState } from 'react';
import Login from './Login';

export default function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        const username = localStorage.getItem('username');
        const limite = localStorage.getItem('limite');
        return username ? { username, limite } : null;
    });

    function handleLogin(data) {
        setToken(data.token);
        setUser({ username: data.username, limite: data.limite });
    }

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('limite');
        setToken(null);
        setUser(null);
    }

    return token ? (
        <Chat token={token} user={user} onLogout={handleLogout} />
    ) : (
        <Login onLogin={handleLogin} />
    );
}
