import { processarMensagemDoAgente } from "./agent.js";

async function executarTeste() {
  
  let historico = [
    { role: "user", content: "Quais produtos vocês têm disponíveis?" }
  ];

  console.log("=== 1. Enviando mensagem para o Agente ===");
  console.log("Usuário:", historico[0].content);

  try {
    
    const resultado = await processarMensagemDoAgente("user_1", historico);

    console.log("\n=== 2. Resposta do Agente ===");
    console.log(resultado.respostaFinal);

    console.log("\n=== 3. Histórico completo de execução (incluindo Tools) ===");
    console.dir(resultado.historicoAtualizado, { depth: null });

  } catch (erro) {
    console.error("Erro durante a execução:", erro);
  }
}

executarTeste();