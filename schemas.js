import { listarCatalogo, registrarIntencao, realizarCompra } from "./tools.js";


export const TOOLS_SCHEMA = [
  {
    type: "function",
    function: {
      name: "listar_catalogo",
      description: "Retorna os produtos disponíveis no catálogo.",
      parameters: {
        type: "object",
        properties: {
          categoria: { type: "string", description: "Filtro opcional por categoria" }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "registrar_intencao",
      description: "Registra a intenção de compra de um item antes do pagamento.",
      parameters: {
        type: "object",
        properties: {
          produto_id: { type: "string", description: "ID do produto presente no catálogo" },
          quantidade: { type: "number", description: "Quantidade desejada (inteiro maior que 0)" }
        },
        required: ["produto_id", "quantidade"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "realizar_compra",
      description: "Executa a compra a partir de uma intenção previamente registrada.",
      parameters: {
        type: "object",
        properties: {
          intencao_id: { type: "string", description: "Identificador retornado por registrar_intencao" },
          metodo_pagamento: { type: "string", enum: ["cartao", "pix"], description: "Método de pagamento escolhido" }
        },
        required: ["intencao_id", "metodo_pagamento"]
      }
    }
  }
];


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
  throw new Error(`Ferramenta não reconhecida: ${name}`);
}