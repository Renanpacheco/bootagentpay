import { useState } from 'react';
import { login } from './api';

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');
        setLoading(true);
        try {
            const { data } = await login(username, password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('limite', data.limite);
            onLogin(data);
        } catch {
            setErro('Usuário ou senha inválidos.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-shell">
            <div className="login-brand">
                <div className="login-brand-mark">
                    <span className="dot" />
                    pagamentos.ai
                </div>
                <div className="login-brand-copy">
                    <h1>Compre conversando. O agente cuida do resto.</h1>
                    <p>
                        Um chat que entende o que você quer comprar, confere seu limite e
                        fecha o pagamento.
                    </p>
                </div>
                <div className="login-brand-foot">sessão protegida por token</div>
            </div>

            <div className="login-form-side">
                <div className="login-card">
                    <h2>Entrar</h2>
                    <p className="sub">Acesse sua conta para começar a comprar.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label htmlFor="username">Usuário</label>
                            <input
                                id="username"
                                placeholder="ex: ana"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                autoComplete="username"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="password">Senha</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>

                        {erro && <div className="error-banner">{erro}</div>}
                    </form>

                    <div className="hint-box">
                        <p>Usuários de teste</p>
                        <div className="hint-row">
                            <span><code>ana</code> / 123456</span>
                            <span>limite R$500</span>
                        </div>
                        <div className="hint-row">
                            <span><code>bruno</code> / 123456</span>
                            <span>limite R$2000</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
