import { generateStep } from "./llm";
import {
    getSession,
    isDone,
    commitStep,
    getSubscribers,
    broadcastStep,
    broadcastDone,
    broadcastError,
    deleteSession,
    normalizeStepIds,
  } from "./sessionStore";


//prevent duplicate runs
const running = new Set<string>();

export async function startSessionRunner(sessionId: string) {
    if (running.has(sessionId)) {
      console.log(`[Backend] [Runner] Session ${sessionId} already running, skipping`);
      return;
    }
    running.add(sessionId);
    console.log(`[Backend] [Runner] Starting runner for session ${sessionId}`);
  
    try {
      while (true) {
        const s = getSession(sessionId);
        if (!s) {
          console.log(`[Backend] [Runner] Session ${sessionId} not found, stopping`);
          return;
        }
  
        // stop if user closed tab
        if (getSubscribers(sessionId).size === 0) {
          console.log(`[Backend] [Runner] No subscribers for session ${sessionId}, stopping`);
          deleteSession(sessionId);
          return;
        }
  
        if (isDone(sessionId)) {
          console.log(`[Backend] [Runner] All steps complete for session ${sessionId}`);
          broadcastDone(sessionId);
          return;
        }
  
        const stepIndex = s.currentStep;
        console.log(`[Backend] [Runner] Generating step ${stepIndex + 1}/${s.outline.length} for session ${sessionId}`);
        const step = await generateStep(
          s.prompt,
          stepIndex,
          s.outline,
          s.prevStep ? JSON.stringify(s.prevStep) : undefined,
          s.objects,
          s.whiteboardLines
        );
        const normalizedStep = normalizeStepIds(s, step);
        broadcastStep(sessionId, normalizedStep);
        commitStep(sessionId, normalizedStep);
      }
    } catch (e: any) {
      console.error(`[Backend] [Runner] Error in session ${sessionId}:`, e?.message || e);
      broadcastError(sessionId, e?.message || "Runner crashed");
      deleteSession(sessionId);
    } finally {
      running.delete(sessionId);
      console.log(`[Backend] [Runner] Stopped runner for session ${sessionId}`);
    }
  }