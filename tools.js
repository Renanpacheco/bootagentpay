import { CATALOGO, usuariosDB, intencoesDB } from "./database.js";


export function listarCatalogo(categoria) {
  if (categoria) {
    const filtrados = CATALOGO.filter(
      (p) => p.categoria.toLowerCase() === categoria.toLowerCase()
    );
    return { produtos: filtrados };
  }
  return { produtos: CATALOGO };
}


export function registrarIntencao(usuarioId, produtoId, quantidade) {
  const produto = CATALOGO.find((p) => p.id === produtoId);
  if (!produto) {
    return { erro: "PRODUTO_NAO_ENCONTRADO", mensagem: "Produto não existe no catálogo." };
  }

  const qtd = Number(quantidade);
  if (isNaN(qtd) || qtd <= 0) {
    return { erro: "QUANTIDADE_INVALIDA", mensagem: "Quantidade deve ser maior que zero." };
  }

  const valorTotal = produto.preco * qtd;
  const intencaoId = `int_${Math.random().toString(36).substring(2, 9)}`;
  const expiraEm = new Date(Date.now() + 15 * 60 * 1000);

  const novaIntencao = {
    intencao_id: intencaoId,
    usuario_id: usuarioId,
    produto_id: produtoId,
    quantidade: qtd,
    valor_total: valorTotal,
    moeda: "BRL",
    status: "pendente",
    expira_em: expiraEm,
  };

  intencoesDB.set(intencaoId, novaIntencao);

  return {
    intencao_id: novaIntencao.intencao_id,
    produto_id: novaIntencao.produto_id,
    quantidade: novaIntencao.quantidade,
    valor_total: novaIntencao.valor_total,
    moeda: novaIntencao.moeda,
    status: novaIntencao.status,
    expira_em: novaIntencao.expira_em.toISOString(),
  };
}

export function realizarCompra(usuarioId, intencaoId, metodoPagamento) {
  const intencao = intencoesDB.get(intencaoId);

  
  if (!intencao || intencao.usuario_id !== usuarioId) {
    return {
      status: "recusado",
      erro: "INTENCAO_INVALIDA",
      mensagem: "Intenção de compra inválida ou não pertence a esta sessão."
    };
  }

  
  if (intencao.status === "paga") {
    return {
      status: "recusado",
      erro: "INTENCAO_JA_PAGA",
      mensagem: "Esta intenção de compra já foi finalizada."
    };
  }

 
  if (new Date() > intencao.expira_em) {
    intencao.status = "expirada";
    return {
      status: "recusado",
      erro: "INTENCAO_EXPIRADA",
      mensagem: "O prazo de validade desta intenção expirou."
    };
  }

  const usuario = usuariosDB[usuarioId];

  
  if (intencao.valor_total > usuario.limite) {
    return {
      status: "recusado",
      erro: "LIMITE_EXCEDIDO",
      mensagem: `Compra recusada. O valor de R$ ${intencao.valor_total.toFixed(2)} excede o limite disponível de R$ ${usuario.limite.toFixed(2)}.`
    };
  }

  
  if (metodoPagamento !== "cartao" && metodoPagamento !== "pix") {
    return {
      status: "recusado",
      erro: "METODO_INVALIDO",
      mensagem: "Método de pagamento deve ser 'cartao' ou 'pix'."
    };
  }

  
  usuario.limite -= intencao.valor_total;
  intencao.status = "paga";

  return {
    status: "aprovado",
    transacao_id: `tx_${Math.random().toString(36).substring(2, 9)}`,
    intencao_id: intencao.intencao_id,
    valor: intencao.valor_total,
    metodo_pagamento: metodoPagamento,
    limite_restante: usuario.limite,
    data: new Date().toISOString()
  };
}