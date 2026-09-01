import { TOOLS_SCHEMA } from "../schemas/schemas.js";
import { listProducts, registerIntent, makePurchase } from "../controllers/tools.js";

function executeToolOnBackend(userId, name, args) {
  if (name === "list_catalog") {
    return listProducts(args.category);
  }
  if (name === "register_intent") {
    return registerIntent(userId, args.product_id, args.quantity);
  }
  if (name === "make_purchase") {
    return makePurchase(userId, args.intent_id, args.payment_method);
  }
  throw new Error(`Unknown tool: ${name}`);
}

export async function processAgentMessage(userId, messageHistory) {
  const OLLAMA_URL = process.env.OLLAMA_URL;

  let payload = {
    model: process.env.MODEL_NAME,
    messages: messageHistory,
    tools: TOOLS_SCHEMA,
    stream: false
  };

  let response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  let data = await response.json();
  let aiMessage = data.message;

  if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
    messageHistory.push(aiMessage);

    for (const toolCall of aiMessage.tool_calls) {
      const toolName = toolCall.function.name;
      const args = toolCall.function.arguments;

      const backendResult = executeToolOnBackend(userId, toolName, args);

      messageHistory.push({
        role: "tool",
        name: toolName,
        content: JSON.stringify(backendResult)
      });
    }

    payload.messages = messageHistory;

    response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    data = await response.json();
    aiMessage = data.message;
  }

  messageHistory.push(aiMessage);

  return {
    finalResponse: aiMessage.content,
    updatedHistory: messageHistory
  };
}