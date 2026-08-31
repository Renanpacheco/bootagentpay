import { useEffect, useRef, useState } from 'react';
import { enviarMensagemChat } from './api';

export default function Chat({ user, onLogout }) {
    const [historico, setHistorico] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    // Normaliza o nome do usuário vindo da prop ou do localStorage
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
            // O token já é pego internamente no api.js via localStorage
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
        <div className="app-shell">
            <header className="app-header">
                <div className="brand">
                    <span className="dot" />
                    pagamentos.ai
                </div>
                <div className="user-info">
                    {nomeUsuario && <span>Olá, {nomeUsuario}</span>}
                    {limiteUsuario && <span className="limite-tag">limite R${Number(limiteUsuario).toFixed(2)}</span>}
                    <button className="logout-btn" onClick={onLogout}>Sair</button>
                </div>
            </header>

            <div className="chat-wrap">
                <div className="chat-panel">
                    <div className="chat-scroll" ref={scrollRef}>
                        {mensagensVisiveis.length === 0 && !loading && (
                            <div className="empty-state">
                                <div className="icon">$</div>
                                <p>Pergunte o que temos à venda, escolha um produto e finalize a compra por aqui mesmo.</p>
                            </div>
                        )}

                        {mensagensVisiveis.map((m, i) => (
                            <div key={i} className={`msg-row ${m.role === 'user' ? 'user' : 'agent'}`}>
                                <div className={`avatar ${m.role === 'user' ? 'user' : 'agent'}`}>
                                    {m.role === 'user' ? (nomeUsuario[0]?.toUpperCase() || 'V') : 'A'}
                                </div>
                                <div className={`bubble ${m.role === 'user' ? 'user' : 'agent'}`}>{m.content}</div>
                            </div>
                        ))}

                        {loading && (
                            <div className="typing-row">
                                <div className="avatar agent">A</div>
                                <div className="typing-dots">
                                    <span /><span /><span />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="composer">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && enviar()}
                            placeholder="Digite sua mensagem..."
                            disabled={loading}
                        />
                        <button className="send-btn" onClick={enviar} disabled={loading || !input.trim()} aria-label="Enviar">
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