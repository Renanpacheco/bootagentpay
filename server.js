import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const usuariosDB = {
  "user_1": { id: "user_1", nome: "Dev QA", limite: 300.00 },
  "user_2": { id: "user_2", nome: "Maria Silva", limite: 1000.00 }
};


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


  return res.status(200).json({
    status: "sucesso",
    usuario_autenticado: req.usuario.nome,
    mensagem_recebida: history[history.length - 1] || null
  });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor da API rodando na porta ${PORT}`);
});