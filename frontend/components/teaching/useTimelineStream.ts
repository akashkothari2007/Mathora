import { useEffect, useRef, useState } from "react";
import { normalizeSteps } from "../math/timeline/NormalizeTimeline";
import type { Step } from "../math/types/steps";

type StartResponse = { sessionId: string; firstStep: any[]; totalSteps: number; error?: string };

export function useTimelineStream(prompt: string, onNewChat: () => void) {
  const [steps, setSteps] = useState<Step[] | null>(null);
  const [totalSteps, setTotalSteps] = useState<number>(0);

  // Only need refs for things that persist across the async flow
  const eventSourceRef = useRef<EventSource | null>(null);
  const rawStepsRef = useRef<any[]>([]);

  if (!prompt) return { steps: null, totalSteps: 0 };

  useEffect(() => {
    // Fresh AbortController for THIS effect instance
    const controller = new AbortController();

    // Cleanup any previous SSE connection
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    rawStepsRef.current = [];
    setSteps(null);
    setTotalSteps(0);
    async function run() {
      try {
        // Pass signal to fetch - if controller.abort() is called, fetch throws AbortError
        const resp = await fetch("http://localhost:3001/timeline/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
          signal: controller.signal,
        });

        if (!resp.ok) {
          const e = await resp.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(e.error || `HTTP ${resp.status}`);
        }

        const data = (await resp.json()) as StartResponse;
        if (!data?.firstStep || !Array.isArray(data.firstStep)) {
          throw new Error("firstStep missing or not an array");
        }

        // If aborted between fetch completing and here, bail out
        if (controller.signal.aborted) return;

        console.log("data", data);

        rawStepsRef.current = data.firstStep;
        setSteps(normalizeSteps(rawStepsRef.current));
        setTotalSteps(data.totalSteps);

        const es = new EventSource(
          `http://localhost:3001/timeline/stream/${data.sessionId}`
        );
        eventSourceRef.current = es;

        es.addEventListener("step", (event) => {
          const payload = JSON.parse((event as MessageEvent).data);
          rawStepsRef.current = [...rawStepsRef.current, payload.step];
          setSteps(normalizeSteps(rawStepsRef.current));
        });

        es.addEventListener("done", () => {
          es.close();
          if (eventSourceRef.current === es) eventSourceRef.current = null;
        });

        es.addEventListener("error", (event) => {
          try {
            const payload = JSON.parse((event as MessageEvent).data);
            alert(payload.error || "Streaming error");
          } catch {
            console.error("[Frontend] SSE network error/reconnect");
          }
          es.close();
          if (eventSourceRef.current === es) eventSourceRef.current = null;
        });
      } catch (err: any) {
        // AbortError is expected when cleanup cancels the fetch - ignore it
        if (err.name === "AbortError") return;

        alert(`Failed to generate timeline: ${err?.message || "Unknown error"}`);
        onNewChat();
      }
    }

    run();

    // Cleanup: abort fetch + close SSE
    return () => {
      controller.abort();
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };
  }, [prompt, onNewChat]);

  return { steps, totalSteps };
}