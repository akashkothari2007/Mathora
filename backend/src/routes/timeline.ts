import { Router } from "express";
import { generateTimeline} from "../routes/services/llm";

const router = Router();

router.post("/", async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[Backend] ========== REQUEST ${requestId} RECEIVED ==========`);
  console.log(`[Backend] Request body:`, JSON.stringify(req.body, null, 2));
  
  try {
    const { prompt } = req.body;

    if (!prompt) {
      console.error(`[Backend] REQUEST ${requestId}: Missing prompt in request body`);
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log(`[Backend] REQUEST ${requestId}: Starting timeline generation for prompt: "${prompt}"`);
    const timeline = await generateTimeline(prompt);
    console.log(`[Backend] REQUEST ${requestId}: Timeline generated successfully, ${timeline.length} steps`);
    console.log(`[Backend] ========== REQUEST ${requestId} SUCCESS ==========`);
    
    res.json({ timeline });
  } catch (err: any) {
    console.error(`[Backend] ========== REQUEST ${requestId} FAILED ==========`);
    console.error(`[Backend] REQUEST ${requestId}: Error:`, err.message);
    res.status(400).json({ error: err.message });
  }
});

export default router;