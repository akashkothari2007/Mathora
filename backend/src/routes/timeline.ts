import { Router } from "express";
import { generateOutline, generateStep} from "../routes/services/llm";


const router = Router();

const sessions = new Map<string, {
  outline: string[]
  currentStep: number
}>();

router.post("/start", async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[Backend] ========== REQUEST ${requestId} RECEIVED ==========`);

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log(`[Backend] REQUEST ${requestId}: Generating outline for prompt: "${prompt}"`);
    const outline = await generateOutline(prompt);

    console.log(`[Backend] REQUEST ${requestId}: Generating first step for prompt: "${prompt}"`);
    const firstStep = await generateStep(
      prompt,
      0,
      outline,
      null
    );
    console.log(`[Backend] REQUEST ${requestId}: First step generated: "${firstStep}"`);
    const sessionId = Math.random().toString(36).slice(2);

    sessions.set(sessionId, {
      outline,
      currentStep: 1, // next step index
    });

    console.log(`[Backend] REQUEST ${requestId}: Session ${sessionId} created`);

    res.json({
      sessionId,
      firstStep: [firstStep]
    });

  } catch (err: any) {
    console.error(`[Backend] REQUEST ${requestId}: Error`, err.message);
    res.status(500).json({ error: err.message });
  }
});



export default router;