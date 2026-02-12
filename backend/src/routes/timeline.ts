import { Router } from "express";
import { generateOutline, generateStep} from "../routes/services/llm";
import { startSessionRunner } from "../routes/services/sessionRunner";
import {
  createSession,
  getSession,
  addSubscriber,
  removeSubscriber,
} from "../routes/services/sessionStore";


const router = Router();



router.post("/start", async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  const t0 = Date.now();

  try {
    const { prompt } = req.body;
    console.log(`[Backend] [${requestId}] Received prompt: "${prompt}"`);

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const outline = await generateOutline(prompt);
    console.log(`[Backend] [${requestId}] Outline generated (${outline.length} steps)`);
    if (outline.length === 1 && outline[0].subtitle?.startsWith("Error:")) {
      const errorStep = {
        subtitle: outline[0].subtitle.replace(/^Error:\s*/i, "") || "I can only help with math questions. Try asking about calculus, algebra, or geometry!",
        actions: [],
      };
      const session = createSession({
        prompt,
        outline,
        firstStep: errorStep,
      });
      return res.json({
        sessionId: session.id,
        firstStep: [errorStep],
        totalSteps: 1
      });
    }
    

    const firstStep = await generateStep(prompt, 0, outline, undefined);
    const t1 = Date.now();
    console.log(`[Backend] [${requestId}] First step generated in ${t1 - t0}ms`);

    const session = createSession({ prompt, outline, firstStep });
    console.log(`[Backend] [${requestId}] Session created: ${session.id}`);

    res.json({
      sessionId: session.id,
      firstStep: [firstStep],
      totalSteps: outline.length
    });

  } catch (err: any) {
    console.error(`[Backend] [${requestId}] Error:`, err.message);
    res.status(500).json({ error: err.message });
  }
});


//SSE Streaming
router.get("/stream/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  const session = getSession(sessionId);
  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }
  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  // If behind nginx/proxies, this helps reduce buffering
  res.setHeader("X-Accel-Buffering", "no");

  //flush headers so client connects right away
  res.flushHeaders?.();

  addSubscriber(sessionId, res);
  console.log(`[Backend] [SSE] Connection established for session ${sessionId}`);

  res.write(`event: connected\ndata: ${JSON.stringify({ sessionId })}\n\n`);

  startSessionRunner(sessionId);

  // If client closes the tab / connection, cleanup
  req.on("close", () => {
    removeSubscriber(sessionId, res);
    console.log(`[Backend] [SSE] Connection closed for session ${sessionId}`);
  });
});


export default router;