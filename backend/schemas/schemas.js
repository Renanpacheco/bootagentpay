export const TOOLS_SCHEMA = [
  {
    type: "function",
    function: {
      name: "list_catalog",
      description: "Returns the available products in the catalog.",
      parameters: {
        type: "object",
        properties: {
          category: { type: "string", description: "Optional category filter" }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "register_intent",
      description: "Registers a purchase intent for an item before payment.",
      parameters: {
        type: "object",
        properties: {
          product_id: { type: "string", description: "Product ID present in the catalog" },
          quantity: { type: "number", description: "Desired quantity (integer greater than 0)" }
        },
        required: ["product_id", "quantity"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "make_purchase",
      description: "Executes the purchase from a previously registered intent.",
      parameters: {
        type: "object",
        properties: {
          intent_id: { type: "string", description: "Identifier returned by register_intent" },
          payment_method: { type: "string", enum: ["cartao", "pix"], description: "Payment method" }
        },
        required: ["intent_id", "payment_method"]
      }
    }
  }
];