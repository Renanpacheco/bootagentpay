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
          metodo_pagamento: { type: "string", enum: ["cartao", "pix"], description: "Método de pagamento" }
        },
        required: ["intencao_id", "metodo_pagamento"]
      }
    }
  }
];