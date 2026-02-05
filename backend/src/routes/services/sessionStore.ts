import type { Action, Step } from "./schema";
import type { Response } from "express";

export type Session = {
    id: string;
    prompt: string;
    outline: string[];
    currentStep: number;
    prevStep: Step | null;

    subscribers: Set<Response>;
    objects: Record<string, NonNullable<Action["object"]>>
}

const sessions = new Map<string, Session>();


//make random id for session
function makeId() {
    return Math.random().toString(36).slice(2);
}

//create new session
export function createSession(args: {
    prompt: string;
    outline: string[]
    firstStep: Step;
}): Session {
    const id = makeId();
    const session: Session = {
        id,
        prompt: args.prompt,
        outline: args.outline,
        currentStep: 1,
        prevStep: args.firstStep,
        subscribers: new Set(),
        objects: {},
    }
    update_object_state(session, args.firstStep);
    sessions.set(id, session)
    return session
}

export function getSession(sessionId: string): Session | null {
    return sessions.get(sessionId) ?? null;
}

export function deleteSession(sessionId: string) {
    const s = sessions.get(sessionId);
    if (!s) return;
      for (const res of s.subscribers) {
      try {
        res.end();
      } catch {}
    }
  
    sessions.delete(sessionId);
  }

  //advance session to next step
  export function commitStep(sessionId: string, step: Step) {
    const s = sessions.get(sessionId);
    if (!s) throw new Error("Session not found");
  
    s.prevStep = step;
    s.currentStep += 1;

    update_object_state(s, step)
    console.log(`[Backend] [SSE] Committed step ${s.currentStep}, now at step ${s.currentStep + 1}/${s.outline.length}`);
  }
  //if steps run out stop streaming
  export function isDone(sessionId: string): boolean {
    const s = sessions.get(sessionId);
    if (!s) return true;
    return s.currentStep >= s.outline.length;
  }
  

  //subscriber management
  export function addSubscriber(sessionId: string, res: Response) {
    const s = sessions.get(sessionId);
    if (!s) throw new Error("Session not found");
    s.subscribers.add(res);
  }
  
  export function removeSubscriber(sessionId: string, res: Response) {
    const s = sessions.get(sessionId);
    if (!s) return;
    s.subscribers.delete(res);
  }
  
  export function getSubscribers(sessionId: string): Set<Response> {
    const s = sessions.get(sessionId);
    if (!s) return new Set();
    return s.subscribers;
  }


// helpers for SSE
function sseWrite(res: Response, event: string, data: any) {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }
  
//send step to connected clients
export function broadcastStep(sessionId: string, step: Step) {
    const s = sessions.get(sessionId);
    if (!s) return;
  
    const payload = {
      step,
      currentStep: s.currentStep,   
      totalSteps: s.outline.length,
      done: false,
    };
  
    console.log(`[Backend] [SSE] Broadcasting step ${s.currentStep + 1}/${s.outline.length} for session ${sessionId}`);
    console.log(`[Backend] [SSE] Payload:`, JSON.stringify({ step, currentStep: payload.currentStep, totalSteps: payload.totalSteps}, null, 2));
    if (s.subscribers.size === 0) {
      console.log(`[Backend] [SSE] No subscribers for session ${sessionId}, cannot broadcast`);
      return;
    }
    for (const res of s.subscribers) {
      try {
        sseWrite(res, "step", payload);
      } catch {
        // if write fails, drop the subscriber
        s.subscribers.delete(res);
      }
    }
  }
  
  //broadcast is done tell clients its done
  export function broadcastDone(sessionId: string) {
    const s = sessions.get(sessionId);
    if (!s) return;
  
    console.log(`[Backend] [SSE] Broadcasting done for session ${sessionId}`);
    const payload = { done: true };
  
    for (const res of s.subscribers) {
      try {
        sseWrite(res, "done", payload);
        res.end();
      } catch {}
    }
  
    // delete session
    sessions.delete(sessionId);
  }
  
  // error for frontend to see
  export function broadcastError(sessionId: string, message: string) {
    const s = sessions.get(sessionId);
    if (!s) return;
  
    console.error(`[Backend] [SSE] Broadcasting error for session ${sessionId}:`, message);
    const payload = { error: message };
  
    for (const res of s.subscribers) {
      try {
        sseWrite(res, "error", payload);
      } catch {
        s.subscribers.delete(res);
      }
    }
  }


export function update_object_state(session: Session, step: Step){
    if (!step.actions) return;
    for (const action of step.actions) {
      if (action.type === "add" && action.object) {
        session.objects[action.object.id] = action.object;
    }
      else if (action.type === "update" && action.id && action.props) {
        if (session.objects[action.id]) {
          session.objects[action.id].props = {
            ...session.objects[action.id].props, 
            ...action.props,};
        }
    } else if (action.type === "remove" && action.id) {
        delete session.objects[action.id];
    }
  }
}