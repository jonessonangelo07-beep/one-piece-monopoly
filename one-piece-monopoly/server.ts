import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/narrate", async (req, res) => {
    try {
      const { logs } = req.body;
      if (!logs || !Array.isArray(logs)) {
        return res.status(400).json({ error: "Logs array is required" });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const recentLogs = logs.slice(-5).join("\n");
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are a pirate narrator for a One Piece themed Monopoly game. 
Read the following recent game events and provide a short, flavorful, 1-2 sentence pirate commentary on what just happened. 
Keep it fun, energetic, and in the style of a One Piece character (like Morgan or a generic pirate captain).
Do not repeat the exact events, just react to them.

Recent events:
${recentLogs}`
      });

      res.json({ commentary: response.text });
    } catch (error) {
      console.error("Error generating commentary:", error);
      res.status(500).json({ error: "Failed to generate commentary" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
