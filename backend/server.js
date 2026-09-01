import express from "express";
import cors from "cors";
import { userDB } from "./database/database.js";
import { processAgentMessage } from "./agents/agent.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

const validTokens = new Map();

function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      error: "UNAUTHORIZED", 
      message: "Authentication token not provided. Please log in to access." 
    });
  }

  const token = authHeader.split(" ")[1];
  const userId = validTokens.get(token);

  if (!userId || !userDB[userId]) {
    return res.status(401).json({ 
      error: "INVALID_TOKEN", 
      message: "Invalid token or expired session. Please log in again." 
    });
  }

  req.user = userDB[userId];
  next();
}

app.post("/api/login", (req, res) => {
  const { userId, password } = req.body;

  const user = userDB[userId];

  if (!user || String(user.password) !== String(password)) {
    return res.status(401).json({ 
      error: "INVALID_CREDENTIALS", 
      message: "Incorrect user or password." 
    });
  }

  const token = `token_${Math.random().toString(36).substring(2, 10)}`;
  validTokens.set(token, userId);

  return res.status(200).json({
    message: "Login successful!",
    token: token,
    user: {
      id: user.id,
      name: user.name,
      limit: user.limit
    }
  });
});

app.post("/api/chat", authenticateUser, async (req, res) => {
  const { history } = req.body;

  if (!Array.isArray(history)) {
    return res.status(400).json({ 
      error: "INVALID_REQUEST", 
      message: "The request body must contain a 'history' array." 
    });
  }

  try {
    const result = await processAgentMessage(req.user.id, history);

    return res.status(200).json({
      response: result.finalResponse,
      history: result.updatedHistory
    });
  } catch (error) {
    console.error("Error processing chat:", error);
    return res.status(500).json({ 
      error: "INTERNAL_ERROR", 
      message: "Failed to process agent response." 
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend API running on port ${PORT}`);
});