import { PRODUCTS, userDB, intentionsDB } from "../database/database.js";

export function listProducts(category) {
  if (category) {
    const filtered = PRODUCTS.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
    return { products: filtered };
  }
  return { products: PRODUCTS };
}

export function registerIntent(userId, productId, quantity) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) {
    return { error: "PRODUCT_NOT_FOUND", message: "Product does not exist in the catalog." };
  }

  const qty = Number(quantity);
  if (isNaN(qty) || qty <= 0) {
    return { error: "INVALID_QUANTITY", message: "Quantity must be greater than zero." };
  }

  const totalValue = product.price * qty;
  const intentId = `int_${Math.random().toString(36).substring(2, 9)}`;
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  const newIntent = {
    intent_id: intentId,
    user_id: userId,
    product_id: productId,
    quantity: qty,
    total: totalValue,
    currency: "BRL",
    status: "pendente",
    expires_at: expiresAt,
  };

  intentionsDB.set(intentId, newIntent);

  return {
    intent_id: newIntent.intent_id,
    product_id: newIntent.product_id,
    quantity: newIntent.quantity,
    total: newIntent.total,
    currency: newIntent.currency,
    status: newIntent.status,
    expires_at: newIntent.expires_at.toISOString(),
  };
}

export function makePurchase(userId, intentId, paymentMethod) {
  const intent = intentionsDB.get(intentId);

  if (!intent || intent.user_id !== userId) {
    return {
      status: "refused",
      error: "INVALID_INTENT",
      message: "Purchase intent is invalid or does not belong to this session."
    };
  }

  if (intent.status === "finished") {
    return {
      status: "refused",
      error: "INTENT_ALREADY_PAID",
      message: "This purchase intent has already been completed."
    };
  }

  if (new Date() > intent.expires_at) {
    intent.status = "expirada";
    return {
      status: "refused",
      error: "EXPIRED_INTENT",
      message: "The validity period for this intent has expired."
    };
  }

  const user = userDB[userId];

  if (intent.total > user.limite) {
    return {
      status: "refused",
      error: "LIMIT_EXCEEDED",
      message: `Purchase refused. The amount of R$ ${intent.total.toFixed(2)} exceeds the available limit of R$ ${user.limite.toFixed(2)}.`
    };
  }

  if (paymentMethod !== "cartao" && paymentMethod !== "pix") {
    return {
      status: "refused",
      error: "INVALID_METHOD",
      message: "Payment method must be 'cartao' or 'pix'."
    };
  }

  user.limite -= intent.total;
  intent.status = "finished";

  return {
    status: "approved",
    transacao_id: `tx_${Math.random().toString(36).substring(2, 9)}`,
    intent_id: intent.intent_id,
    valor: intent.total,
    metodo_finishedmento: paymentMethod,
    limite_restante: user.limite,
    data: new Date().toISOString()
  };
}