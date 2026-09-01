import { TOOLS_SCHEMA } from "../schemas/schemas.js";
import { listarCatalogo, registrarIntencao, realizarCompra } from "../controllers/tools.js";

function executarToolNoBackend(usuarioId, name, args) {
  if (name === "listar_catalogo") {
    return listarCatalogo(args.categoria);
  }
  if (name === "registrar_intencao") {
    return registrarIntencao(usuarioId, args.produto_id, args.quantidade);
  }
  if (name === "realizar_compra") {
    return realizarCompra(usuarioId, args.intencao_id, args.metodo_pagamento);
  }
  throw new Error(`Tool desconhecida: ${name}`);
}

export async function processarMensagemDoAgente(usuarioId, historicoMensagens) {
  const OLLAMA_URL = process.env.OLLAMA_URL;

  let payload = {
    model: process.env.MODEL_NAME,
    messages: historicoMensagens,
    tools: TOOLS_SCHEMA,
    stream: false
  };

  let response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  let data = await response.json();
  let mensagemIa = data.message;

  
  if (mensagemIa.tool_calls && mensagemIa.tool_calls.length > 0) {
    historicoMensagens.push(mensagemIa);

    for (const toolCall of mensagemIa.tool_calls) {
      const nomeTool = toolCall.function.name;
      const argumentos = toolCall.function.arguments;

      const resultadoBackend = executarToolNoBackend(usuarioId, nomeTool, argumentos);

      historicoMensagens.push({
        role: "tool",
        name: nomeTool,
        content: JSON.stringify(resultadoBackend)
      });
    }

    
    payload.messages = historicoMensagens;

    response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    data = await response.json();
    mensagemIa = data.message;
  }

  historicoMensagens.push(mensagemIa);

  return {
    respostaFinal: mensagemIa.content,
    historicoAtualizado: historicoMensagens
  };
}