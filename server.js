import express from "express";
import cors from "cors";
import { usuariosDB } from "./database.js";
import { processarMensagemDoAgente } from "./agent.js";

const app = express();

app.use(cors());
app.use(express.json());


const tokensValidos = new Map();


function autenticarUsuario(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      erro: "NAO_AUTORIZADO", 
      mensagem: "Token de autenticação não fornecido. Faça login para acessar." 
    });
  }

  const token = authHeader.split(" ")[1];
  const usuarioId = tokensValidos.get(token);

  if (!usuarioId || !usuariosDB[usuarioId]) {
    return res.status(401).json({ 
      erro: "TOKEN_INVALIDO", 
      mensagem: "Token inválido ou sessão expirada. Faça login novamente." 
    });
  }

  
  req.usuario = usuariosDB[usuarioId];
  next();
}

app.post("/api/login", (req, res) => {
  const { userId } = req.body;

  if (!userId || !usuariosDB[userId]) {
    return res.status(401).json({ 
      erro: "CREDENCIAIS_INVALIDAS", 
      mensagem: "Usuário não encontrado." 
    });
  }

  const token = `token_${Math.random().toString(36).substring(2, 10)}`;
  tokensValidos.set(token, userId);

  return res.status(200).json({
    mensagem: "Login realizado com sucesso!",
    token: token,
    usuario: {
      id: usuariosDB[userId].id,
      nome: usuariosDB[userId].nome,
      limite: usuariosDB[userId].limite
    }
  });
});

app.post("/api/chat", autenticarUsuario, async (req, res) => {
  const { history } = req.body;

  if (!Array.isArray(history)) {
    return res.status(400).json({ 
      erro: "REQUISICAO_INVALIDA", 
      mensagem: "O corpo da requisição deve conter um array 'history'." 
    });
  }

  try {
    const resultado = await processarMensagemDoAgente(req.usuario.id, history);

    return res.status(200).json({
      resposta: resultado.respostaFinal,
      historico: resultado.historicoAtualizado
    });
  } catch (erro) {
    console.error("Erro no processamento do chat:", erro);
    return res.status(500).json({ 
      erro: "ERRO_INTERNO", 
      mensagem: "Falha ao processar a resposta do agente." 
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 API backend rodando na porta ${PORT}`);
});