import { TimelineSchema } from "./schema";
import { buildPrompt } from "./prompt";
import { buildOutlinePrompt } from "./prompt";
import dotenv from "dotenv";
import {jsonrepair} from 'jsonrepair';
import { string } from "zod/v4/core/regexes";
import {StepSchema} from "./schema";
dotenv.config();

const API_KEY = process.env.DEEPSEEK_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

type DeepSeekResponse = {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
};


export async function generateOutline(question: string): Promise<string[]> {
  const prompt = buildOutlinePrompt(question);

  const raw = await callOpenAI(prompt);

  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "");

  const parsed = JSON.parse(cleaned);

  if (!Array.isArray(parsed.outline)) {
    throw new Error("Generated outline is not an array");
  }

  return parsed.outline;
}

export async function generateStep(question: string, step_number:number, outline: string[], previousStepJson?: any){

  const prompt = buildPrompt(
  question,
  step_number,
  outline,
  previousStepJson ? JSON.stringify(previousStepJson) : undefined
);
const raw = await callOpenAI(prompt);
const cleaned = raw
  .trim()
  .replace(/^```json\s*/i, "")
  .replace(/^```\s*/i, "")
  .replace(/\s*```$/, "");
const parsed = StepSchema.parse(JSON.parse(cleaned));
return parsed;
}


async function callDeepSeek(prompt:string){
  const endpoint = "https://api.deepseek.com/v1/chat/completions";
  console.log('[Backend] [LLM] Sending request to DeepSeek API:', endpoint);

  const requestBody = {
    model: "deepseek-chat",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 3000,
    temperature: 0.2,
    response_format: { type: "json_object" },
  };
  console.log('[Backend] [LLM] Request body:', JSON.stringify({ ...requestBody, messages: [{ ...requestBody.messages[0], content: `[${requestBody.messages[0].content.length} chars]` }] }, null, 2));

  const t0 = Date.now();
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

  console.log('[Backend] [LLM] Response received - status:', response.status, response.statusText);

  // First, await and assign to `any`
  const rawData: any = await response.json();
  const t1 = Date.now();
  console.log('[Backend] [LLM] Response time:', t1 - t0, 'ms');
  console.log('[Backend] [LLM] Response parsed, keys:', Object.keys(rawData));
  console.log('[Backend] [LLM] Response model:', rawData.model);
  console.log('[Backend] [LLM] Token usage:', JSON.stringify(rawData.usage, null, 2));

  // Then cast to our type
  const data = rawData as DeepSeekResponse;

  let textResponse = data.choices?.[0]?.message?.content ?? "";
  console.log('[Backend] [LLM] Extracted text response, length:', textResponse.length);
  console.log('[Backend] [LLM] Text response preview (first 300 chars):', textResponse.substring(0, 300));
  
  if (!textResponse) {
    console.error('[Backend] No output text from LLM. Full response:', JSON.stringify(data, null, 2));
    throw new Error("LLM returned no output text");
  }

  // Clean JSON response - remove markdown code blocks if present
  textResponse = textResponse.trim();
  if (textResponse.startsWith('```json')) {
    textResponse = textResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (textResponse.startsWith('```')) {
    textResponse = textResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  textResponse = textResponse.trim();
  textResponse = textResponse.replace(/Math\.PI/g, '3.14159265359')
  
  // Try jsonrepair first
  let repaired = false;
  try {
    const repairedText = jsonrepair(textResponse);
    if (repairedText !== textResponse) {
      console.log('[Backend] [LLM] jsonrepair successfully fixed JSON');
      textResponse = repairedText;
      repaired = true;
    }
  } catch (e: any) {
    console.error('[Backend] [LLM] jsonrepair failed:', e?.message || e);
  }
  return textResponse;
}





async function callOpenAI(prompt: string) {
  const endpoint = "https://api.openai.com/v1/responses";
  if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is missing");

  const requestBody = {
      model: "gpt-4.1-mini",
      input: [{ role: "user", content: prompt }],
      temperature: 0,
  };

  const t0 = Date.now();
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const rawData: any = await response.json();
  const t1 = Date.now();
  console.log(`[Backend] [LLM] Response received in ${t1 - t0}ms`);

  // Extract text from Responses API shape
  let textResponse = "";
  try {
    const output = rawData?.output ?? [];
    for (const item of output) {
      const content = item?.content ?? [];
      for (const c of content) {
        if (c?.type === "output_text" && typeof c?.text === "string") {
          textResponse += c.text;
        }
      }
    }
  } catch (e) {
    console.error("[Backend] [LLM] Failed to extract text from response");
    throw new Error("Failed to parse OpenAI response");
  }

  textResponse = (textResponse || "").trim();

  if (!textResponse) {
    console.error("[Backend] [LLM] No output text from OpenAI");
    throw new Error("OpenAI returned no output text");
  }

  // Cleanup
  textResponse = textResponse
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim()
    .replace(/Math\.PI/g, "3.14159265359");

  // jsonrepair as safety net
  try {
    const repairedText = jsonrepair(textResponse);
    if (repairedText !== textResponse) {
      console.log("[Backend] [LLM] jsonrepair fixed JSON");
      textResponse = repairedText;
    }
  } catch (e: any) {
    console.error("[Backend] [LLM] jsonrepair failed:", e?.message || e);
  }

  return textResponse;
}





// export async function generateTimeline(question: string) {
//   console.log('[Backend] [LLM] Generating timeline for question:', question);
//   console.log('[Backend] [LLM] Using API key:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'MISSING');
  
//   const prompt = buildPrompt(question);
//   console.log('[Backend] [LLM] Built prompt, length:', prompt.length, 'characters');
//   console.log('[Backend] [LLM] Prompt preview (first 300 chars):', prompt.substring(0, 300));

//   let textResponse = callDeepSeek(prompt);
//   let timelineData: unknown;
  
//   // Try parsing the JSON
//   try {
//     timelineData = JSON.parse(textResponse);
//     console.log('[Backend] [LLM] Successfully parsed JSON. Type:', Array.isArray(timelineData) ? 'array' : typeof timelineData);
//     if (Array.isArray(timelineData)) {
//       console.log('[Backend] [LLM] Timeline has', timelineData.length, 'steps');
//     }
//   } catch (err: any) {
//     console.error('[Backend] [LLM] JSON parse failed. Error:', err?.message || err);
//     console.error('[Backend] [LLM] Error position:', err?.toString().match(/position (\d+)/)?.[1] || 'unknown');
    
//     // Try to extract partial valid JSON (find last complete step)
//     console.log('[Backend] [LLM] Attempting partial JSON recovery...');
//     const errorMatch = err?.toString().match(/position (\d+)/);
//     const errorPos = errorMatch ? parseInt(errorMatch[1]) : 0;
    
//     if (errorPos > 50) { // Only try if we have enough content
//       // Simple approach: try to find the last complete Step by looking for }] patterns
//       // Find the last occurrence of }] before the error
//       const beforeError = textResponse.substring(0, errorPos);
//       const lastStepEnd = beforeError.lastIndexOf('}]');
      
//       if (lastStepEnd > 10) {
//         // Try to extract array up to last complete step
//         const partial = beforeError.substring(0, lastStepEnd + 1);
//         let fixed = partial.trim();
        
//         // Remove trailing comma if exists
//         if (fixed.endsWith(',')) {
//           fixed = fixed.slice(0, -1);
//         }
        
//         // Ensure it's a valid array
//         if (fixed.startsWith('[')) {
//           if (!fixed.endsWith(']')) {
//             fixed += ']';
//           }
          
//           try {
//             const recovered = JSON.parse(fixed);
//             if (Array.isArray(recovered) && recovered.length > 0) {
//               console.log('[Backend] [LLM] Partial recovery successful! Extracted', recovered.length, 'complete steps');
//               timelineData = recovered;
//             }
//           } catch (recoveryErr) {
//             console.error('[Backend] [LLM] Partial recovery attempt failed:', (recoveryErr as Error)?.message);
//           }
//         }
//       }
//     }
    
//     if (!timelineData) {
//       console.error('[Backend] [LLM] Text response that failed (first 800 chars):', textResponse.substring(0, 800));
//       throw new Error(`Failed to parse JSON: ${err?.message || 'Unknown error'}`);
//     }
//   }

//   console.log('[Backend] [LLM] Validating with Zod schema...');
//   const parsed = TimelineSchema.parse(timelineData);
//   console.log('[Backend] [LLM] Zod validation passed. Timeline has', parsed.length, 'steps');
//   console.log('[Backend] [LLM] Returning validated timeline to route handler');
//   return parsed;
// }
