import { useState } from 'react';
import { login } from './api';
import ui from './styles/ui.module.css';
import styles from './Login.module.css';

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

            const resposta = await login(username, password);


            localStorage.setItem('token', resposta.token);
            localStorage.setItem('username', resposta.usuario.nome);
            localStorage.setItem('userId', resposta.usuario.id);
            localStorage.setItem('limite', resposta.usuario.limite);


            onLogin(resposta.usuario);
        } catch (err) {

            setErro(err.message || 'Usuário ou senha inválidos.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.shell}>
            <div className={styles.brandPanel}>
                <div className={`${ui.brandLockup} ${ui.brandLockupLg}`}>
                    <span className={`${ui.dot} ${ui.dotSm}`} />
                    pagamentos.ai
                </div>
                <div className={styles.title}>
                    <h1>Compre conversando. O agente cuida do resto.</h1>
                    <p className={styles.subtitle}>
                        Um chat que entende o que você quer comprar, confere seu limite e
                        fecha o pagamento.
                    </p>
                </div>
                <div className={styles.footNote}>sessão protegida por token</div>
            </div>

            <div className={styles.formSide}>
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Entrar</h2>
                    <p className={styles.cardSub}>Acesse sua conta para começar a comprar.</p>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.field}>
                            <label className={styles.fieldLabel} htmlFor="username">Usuário</label>
                            <input
                                id="username"
                                className={ui.input}
                                placeholder="ex: user_1"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                autoComplete="username"
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.fieldLabel} htmlFor="password">Senha</label>
                            <input
                                id="password"
                                className={ui.input}
                                type="password"
                                placeholder="••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                        </div>

                        <button type="submit" className={`${ui.btn} ${ui.btnPrimary}`} disabled={loading}>
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>

                        {erro && <div className={styles.errorBanner}>{erro}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
}