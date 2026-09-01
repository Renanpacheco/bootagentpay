import { useEffect, useRef, useState } from 'react';
import { enviarMensagemChat } from './api';
import ui from './styles/ui.module.css';
import styles from './Chat.module.css';

export default function Chat({ user, onLogout }) {
    const [historico, setHistorico] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);


    const nomeUsuario = user?.nome || user?.username || localStorage.getItem('username') || 'Usuário';
    const limiteUsuario = user?.limite || localStorage.getItem('limite');

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [historico, loading]);

    async function enviar() {
        if (!input.trim() || loading) return;

        const novoHistorico = [...historico, { role: 'user', content: input }];
        setHistorico(novoHistorico);
        setInput('');
        setLoading(true);

        try {

            const dados = await enviarMensagemChat(novoHistorico);
            setHistorico(dados.historico);
        } catch {
            setHistorico([
                ...novoHistorico,
                { role: 'assistant', content: 'Não consegui falar com o servidor agora. Tente de novo em instantes.' },
            ]);
        } finally {
            setLoading(false);
        }
    }

    const mensagensVisiveis = historico.filter(m => m.role === 'user' || m.role === 'assistant');

    return (
        <div className={styles.shell}>
            <header className={styles.header}>
                <div className={`${ui.brandLockup} ${ui.brandLockupSm}`}>
                    <span className={`${ui.dot} ${ui.dotXs}`} />
                    pagamentos.ai
                </div>
                <div className={styles.userInfo}>
                    {nomeUsuario && <span>Olá, {nomeUsuario}</span>}
                    {limiteUsuario && <span className={`${ui.badge} ${ui.badgeDark}`}>limite R${Number(limiteUsuario).toFixed(2)}</span>}
                    <button className={`${ui.btn} ${ui.btnGhost}`} onClick={onLogout}>Sair</button>
                </div>
            </header>

            <div className={styles.wrap}>
                <div className={styles.panelWrap}>
                    <div className={`${ui.panel} ${styles.scrollArea}`} ref={scrollRef}>
                        {mensagensVisiveis.length === 0 && !loading && (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>$</div>
                                <p className={styles.emptyText}>Pergunte o que temos à venda, escolha um produto e finalize a compra por aqui mesmo.</p>
                            </div>
                        )}

                        {mensagensVisiveis.map((m, i) => (
                            <div key={i} className={`${styles.msgRow} ${m.role === 'user' ? styles.msgRowUser : ''}`}>
                                <div className={`${ui.avatar} ${m.role === 'user' ? ui.avatarUser : 'ui.avatarAgent'}`}>
                                    {m.role === 'user' ? (nomeUsuario[0]?.toUpperCase() || 'V') : 'A'}
                                </div>
                                <div className={`${ui.bubble} ${m.role === 'user' ? ui.bubbleUser : ui.bubbleAgent}`}>{m.content}</div>
                            </div>
                        ))}

                        {loading && (
                            <div className={styles.typingRow}>
                                <div className={`${ui.avatar} ${ui.avatarAgent}`}>A</div>
                                <div className={styles.typingDots}>
                                    <span className={ui.dotBounce} /><span className={ui.dotBounce} /><span className={ui.dotBounce} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.composer}>
                        <input
                            className={`${ui.input} ${ui.inputPill}`}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && enviar()}
                            placeholder="Digite sua mensagem..."
                            disabled={loading}
                        />
                        <button className={`${ui.btn} ${ui.btnIcon}`} onClick={enviar} disabled={loading || !input.trim()} aria-label="Enviar">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M4 12L20 4L14 20L11 13L4 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}