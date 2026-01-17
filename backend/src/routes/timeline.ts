import { Router } from "express";
import { generateTimeline } from "../routes/services/llm";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    const timeline = await generateTimeline(prompt);

    res.json({ timeline });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;