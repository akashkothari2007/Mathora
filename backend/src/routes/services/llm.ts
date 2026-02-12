import { Action, Step, TimelineSchema } from "./schema";
import type { OutlineStep } from "./schema";
import { buildPrompt } from "./prompt";
import { buildOutlinePrompt } from "./prompt";
import dotenv from "dotenv";
import { jsonrepair } from "jsonrepair";
import { string } from "zod/v4/core/regexes";
import { StepSchema, StepGenerationResponseSchema, OutlineSchema } from "./schema";
dotenv.config();

const API_KEY = process.env.DEEPSEEK_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


const fallbackStep: Step = {
  subtitle: "Unable to generate this step.",
  actions: [] as Action[],
  whiteboardLines: ["\\text{Step generation failed}"]
};

type DeepSeekResponse = {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
};


export async function generateOutline(question: string): Promise<OutlineStep[]> {
  const prompt = buildOutlinePrompt(question);

  const raw = await callAzureOpenAI(prompt);

  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "");

  const parsed = JSON.parse(cleaned);

  if (!Array.isArray(parsed.outline)) {
    throw new Error("Generated outline is not an array");
  }
  const outline = OutlineSchema.parse(parsed.outline);
  console.log(outline);
  return outline;
}

export async function generateStep(
  question: string,
  step_number: number,
  outline: OutlineStep[],
  previousStepJson?: string,
  objects?: Record<string, NonNullable<Action["object"]>>,
  whiteboardLines?: string[]
): Promise<Step> {
  const max_attempts = 3;
  const subtitleFromOutline = outline[step_number]?.subtitle ?? "";

  for (let attempt = 1; attempt <= max_attempts; attempt++) {
    try {
      const prompt = buildPrompt(question, step_number, outline, previousStepJson, objects, whiteboardLines);
      const raw = await callAzureOpenAI(prompt);
      const cleaned = raw.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "");
      const parsed = StepGenerationResponseSchema.parse(JSON.parse(cleaned));

      const step: Step = {
        subtitle: subtitleFromOutline ?? "",
        actions: parsed.actions ?? [],
        cameraTarget: parsed.cameraTarget ?? undefined,
      };
      StepSchema.parse(step);
      return step;
    } catch (e: any) {
      if (attempt === max_attempts) {
        console.error(`[Backend] [LLM] Failed after ${max_attempts} attempts:`, e?.message || e);
        return {
          ...fallbackStep,
          subtitle: subtitleFromOutline ?? fallbackStep.subtitle,
        };
      }
    }
  }

  return {
    ...fallbackStep,
    subtitle: subtitleFromOutline ?? fallbackStep.subtitle,
  };
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
      model: "gpt-4o-mini",
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


async function callAzureOpenAI(prompt: string) {
  const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY;
  const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
  const AZURE_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT;

  if (!AZURE_OPENAI_KEY || !AZURE_OPENAI_ENDPOINT || !AZURE_DEPLOYMENT) {
    throw new Error("Azure OpenAI env vars missing");
  }

  // Remove trailing slash from env var if it exists
const baseUrl = AZURE_OPENAI_ENDPOINT.replace(/\/+$/, ""); 

const endpoint = `${baseUrl}/openai/deployments/${AZURE_DEPLOYMENT}/chat/completions?api-version=2025-01-01-preview`;
  const requestBody = {
    messages: [
      { role: "user", content: prompt }
    ],
    temperature: 0,
  };

  const t0 = Date.now();
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": AZURE_OPENAI_KEY,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Azure OpenAI error ${response.status}: ${err}`);
  }

  const rawData: any = await response.json();
  const t1 = Date.now();
  console.log(`[Backend] [Azure LLM] Response received in ${t1 - t0}ms`);

  let textResponse = "";

  try {
    const choices = rawData?.choices ?? [];
    for (const choice of choices) {
      const content = choice?.message?.content;
      if (typeof content === "string") {
        textResponse += content;
      }
    }
  } catch {
    throw new Error("Failed to parse Azure OpenAI response");
  }

  textResponse = (textResponse || "").trim();

  if (!textResponse) {
    throw new Error("Azure OpenAI returned no output");
  }

  // Cleanup (same as your original)
  textResponse = textResponse
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim()
    .replace(/Math\.PI/g, "3.14159265359");

  try {
    const repaired = jsonrepair(textResponse);
    if (repaired !== textResponse) {
      console.log("[Azure LLM] jsonrepair fixed JSON");
      textResponse = repaired;
    }
  } catch (e: any) {
    console.error("[Azure LLM] jsonrepair failed:", e?.message || e);
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
