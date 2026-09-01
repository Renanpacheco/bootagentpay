import { processAgentMessage } from "../agents/agent.js";

async function runTest() {
  
  let history = [
    { role: "user", content: "Quais produtos vocês têm disponíveis?" }
  ];

  console.log("=== 1. Sending message to Agent ===");
  console.log("User:", history[0].content);

  try {
    
    const result = await processAgentMessage("user_1", history);

    console.log("\n=== 2. Agent Response ===");
    console.log(result.finalResponse);

    console.log("\n=== 3. Complete Execution History (including Tools) ===");
    console.dir(result.updatedHistory, { depth: null });

  } catch (error) {
    console.error("Error during execution:", error);
  }
}

runTest();