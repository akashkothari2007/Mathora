import fetch from "node-fetch";
import { TimelineSchema } from "./schema";
import { buildPrompt } from "./prompt";

const API_KEY = process.env.GOOGLE_API_KEY;

type GeminiResponse = {
  output?: {
    content?: {
      text?: string;
    }[];
  }[];
};

export async function generateTimeline(question: string) {
  const prompt = buildPrompt(question);

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateText?key=${API_KEY}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: { text: prompt },
      maxOutputTokens: 4000,
      temperature: 0.2,
    }),
  });

  // ✅ First, await and assign to `any`
  const rawData: any = await response.json();

  // ✅ Then cast to our type
  const data = rawData as GeminiResponse;

  const textResponse = data.output?.[0]?.content?.[0]?.text ?? "";

  if (!textResponse) throw new Error("LLM returned no output text");

  let timelineData: unknown;
  try {
    timelineData = JSON.parse(textResponse);
  } catch (err) {
    throw new Error("Failed to parse JSON:\n" + textResponse);
  }

  return TimelineSchema.parse(timelineData);
}
