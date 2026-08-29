import express from "express";
import cors from "cors";
import { usuariosDB } from "./database.js";
import { processarMensagemDoAgente } from "./agent.js";

const app = express();

app.use(cors());
app.use(express.json());


function autenticarUsuario(req, res, next) {
  const usuarioId = req.headers["x-user-id"];

  if (!usuarioId || !usuariosDB[usuarioId]) {
    return res.status(401).json({ 
      erro: "NAO_AUTORIZADO", 
      mensagem: "Acesso negado. Forneça um ID de usuário válido no header 'x-user-id'." 
    });
  }

  req.usuario = usuariosDB[usuarioId];
  next();
}

app.post("/api/login", (req, res) => {
  const { userId } = req.body;

  if (!userId || !usuariosDB[userId]) {
    return res.status(404).json({ 
      erro: "USUARIO_NAO_ENCONTRADO", 
      mensagem: "Usuário não encontrado." 
    });
  }

  return res.status(200).json({
    mensagem: "Login realizado com sucesso!",
    usuario: usuariosDB[userId]
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
      mensagem: "Falha ao processar a mensagem com o agente." 
    });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 API backend rodando na porta ${PORT}`);
});