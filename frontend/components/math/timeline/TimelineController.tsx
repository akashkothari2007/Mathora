'use client'

import { useEffect, useRef, useState } from 'react'
import { Step } from '../types/steps'
import { GraphObject } from '../types/graphObject'
import { CameraTarget } from '../types/cameraTarget'
import type { SceneConfig } from '../types/sceneConfig'
import { handleSubtitle } from './handleSubtitle'
import { applyAttention } from './ActionManager'

type UseTimelineControllerProps = {
  steps: Step[]
  stepIndex: number
  setStepIndex: React.Dispatch<React.SetStateAction<number>>
  setGraphObjects: React.Dispatch<React.SetStateAction<GraphObject[]>>
  setSubtitle: React.Dispatch<React.SetStateAction<string>>
  setCameraTarget: React.Dispatch<React.SetStateAction<CameraTarget | null>>
  executed: React.RefObject<Set<number>>
  setWhiteboardLines: React.Dispatch<React.SetStateAction<string[]>>
  setSceneConfig?: React.Dispatch<React.SetStateAction<SceneConfig | null>>
}

const TIMING_CONFIG = {
  BASE_DELAY: 500,                    // ms before first action (after speech threshold)
  STAGGER_DELAY: 400,                // ms between actions
  AUTO_ADVANCE_BUFFER: 800,          // ms after speech ends (fallback)
  SPEECH_PROGRESS_THRESHOLD: 0.4,     // Wait until 40% of speech is done
  SPEECH_PROGRESS_TIMEOUT: 2000,      // Fallback timeout (ms)
  WHITEBOARD_FIRST_DELAY: 1000,      // ms before first whiteboard line (after speech threshold)
  WHITEBOARD_STAGGER_DELAY: 900,     // ms between whiteboard lines
}

const PAUSE_DURATIONS = {
  short: 500,
  medium: 1000,
  long: 1500,
}

export function useTimelineController({
  steps,
  setGraphObjects,
  setSubtitle,
  setCameraTarget,
  stepIndex,
  setStepIndex,
  executed,
  setWhiteboardLines,
  setSceneConfig,
}: UseTimelineControllerProps) {
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const actionTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const audioEndedHandlerRef = useRef<(() => void) | null>(null);

  // Wait for speech to reach progress threshold
  const waitForSpeechProgress = (audio: HTMLAudioElement | null, threshold: number, timeout: number): Promise<void> => {
    return new Promise((resolve) => {
      if (!audio || !audio.duration) {
        // No audio or duration not available, resolve immediately
        resolve();
        return;
      }

      const checkProgress = () => {
        if (audio.duration && audio.currentTime / audio.duration >= threshold) {
          resolve();
          return;
        }
        // Check again after a short delay
        setTimeout(checkProgress, 100);
      };

      checkProgress();
      // Fallback timeout
      setTimeout(() => resolve(), timeout);
    });
  };

  // Smart auto-advance based on audio duration and pause duration
  const setupAutoAdvance = (audioDuration: number, pauseDuration: "short" | "medium" | "long" | undefined, hasNext: boolean) => {
    // Clear any existing timer
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }

    // Remove previous audio ended handler if it exists
    if (audioRef.current && audioEndedHandlerRef.current) {
      audioRef.current.removeEventListener('ended', audioEndedHandlerRef.current);
      audioEndedHandlerRef.current = null;
    }

    if (!hasNext) return;

    // Calculate auto-advance time: audio duration + pause duration
    const pauseMs = pauseDuration ? PAUSE_DURATIONS[pauseDuration] : TIMING_CONFIG.AUTO_ADVANCE_BUFFER;
    const autoAdvanceTime = audioDuration + pauseMs;

    // Also listen for audio ended event for precise timing
    if (audioRef.current) {
      const pauseMs = pauseDuration ? PAUSE_DURATIONS[pauseDuration] : TIMING_CONFIG.AUTO_ADVANCE_BUFFER;
      const onEnded = () => {
        if (advanceTimerRef.current) {
          clearTimeout(advanceTimerRef.current);
          advanceTimerRef.current = null;
        }
        // Delay after audio ends before advancing (based on pause duration)
        advanceTimerRef.current = setTimeout(() => {
          setStepIndex((prev) => prev + 1);
        }, pauseMs);
      };

      audioEndedHandlerRef.current = onEnded;
      audioRef.current.addEventListener('ended', onEnded, { once: true });
    }

    // Set fallback timer based on estimated duration
    advanceTimerRef.current = setTimeout(() => {
      setStepIndex((prev) => prev + 1);
    }, autoAdvanceTime);
  };

  // Fallback auto-advance using timeToAdvance
  useEffect(() => {
    const step = steps[stepIndex];
    const ms = step?.timeToAdvance;
    const hasNext = stepIndex + 1 < steps.length;
    
    // Only use timeToAdvance if we don't have audio timing
    // (This will be overridden by smart auto-advance if audio duration is available)
    if (ms == null || !hasNext) return;

    // Set a fallback timer, but it will be cleared if smart auto-advance is set up
    const fallbackTimer = setTimeout(() => {
      setStepIndex((prev) => prev + 1);
    }, ms);
    
    advanceTimerRef.current = fallbackTimer;
    
    return () => {
      if (advanceTimerRef.current === fallbackTimer) {
        clearTimeout(fallbackTimer);
        advanceTimerRef.current = null;
      }
    };
  }, [stepIndex, steps, setStepIndex]);

  // execute the current step exactly once
  useEffect(() => {
    if (stepIndex < 0 || stepIndex >= steps.length) return
    if (executed.current.has(stepIndex)) return

    // Clear any pending action timers from previous step
    actionTimersRef.current.forEach(timer => clearTimeout(timer));
    actionTimersRef.current = [];

    // Clear any existing advance timer
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }

    // Clean up previous audio ended handler
    if (audioRef.current && audioEndedHandlerRef.current) {
      audioRef.current.removeEventListener('ended', audioEndedHandlerRef.current);
      audioEndedHandlerRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    executed.current.add(stepIndex)

    const step = steps[stepIndex]
    console.log('Executing step', stepIndex, step)

    // Set camera immediately (no delay needed)
    if (step.cameraTarget) setCameraTarget(step.cameraTarget)
    else setCameraTarget(null)

    // Set scene config when step specifies it
    if (setSceneConfig && step.sceneConfig != null) {
      setSceneConfig(step.sceneConfig)
    }

    // Start speech and get audio timing info
    const audioTimingPromise = handleSubtitle({
      subtitle: step.subtitle ?? '',
      speakSubtitle: step.speakSubtitle ?? step.subtitle ?? '',
      setSubtitle,
      audioRef,
    });

    // Execute actions progressively after speech starts
    audioTimingPromise.then(async (audioTiming) => {
      const actions = step.actions ?? [];
      const whiteboardLines = step.whiteboardLines ?? [];
      
      // Wait for speech to reach progress threshold before starting actions/whiteboard lines
      await waitForSpeechProgress(
        audioRef.current,
        TIMING_CONFIG.SPEECH_PROGRESS_THRESHOLD,
        TIMING_CONFIG.SPEECH_PROGRESS_TIMEOUT
      );

      // Stagger whiteboard lines
      whiteboardLines.forEach((line, index) => {
        const delay = TIMING_CONFIG.WHITEBOARD_FIRST_DELAY + (index * TIMING_CONFIG.WHITEBOARD_STAGGER_DELAY);
        const timer = setTimeout(() => {
          setWhiteboardLines(prev => [...prev, line]);
        }, delay);
        actionTimersRef.current.push(timer);
      });
      
      if (actions.length === 0) {
        // No actions, just set up auto-advance (on first step steps.length may be 1 while rest stream in)
        const lastWhiteboardDelay = whiteboardLines.length > 0 
          ? TIMING_CONFIG.WHITEBOARD_FIRST_DELAY + ((whiteboardLines.length - 1) * TIMING_CONFIG.WHITEBOARD_STAGGER_DELAY)
          : 0;
        const totalStepDuration = Math.max(audioTiming.estimatedDuration, lastWhiteboardDelay);
        const hasNext = stepIndex + 1 < steps.length || steps.length === 1;
        setupAutoAdvance(totalStepDuration, step.pauseDuration, hasNext);
        return;
      }

      // Pre-calculate IDs that will be added/updated for attention states
      const addedIds: string[] = [];
      const updatedIds: string[] = [];
      actions.forEach((action) => {
        if (action.type === 'add' && action.object) {
          addedIds.push(action.object.id);
        } else if (action.type === 'update' && action.id) {
          updatedIds.push(action.id);
        }
      });

      // Execute actions with staggered delays
      actions.forEach((action, index) => {
        const delay = TIMING_CONFIG.BASE_DELAY + (index * TIMING_CONFIG.STAGGER_DELAY);
        
        const timer = setTimeout(() => {
          switch (action.type) {
            case 'add':
              setGraphObjects(prev => [...prev, action.object])
              break

            case 'remove':
              setGraphObjects(prev => prev.filter(obj => obj.id !== action.id))
              break
              
            case 'update':
              setGraphObjects(prev =>
                prev.map(obj =>
                  obj.id === action.id
                    ? { ...obj, props: { ...obj.props, ...action.props } }
                    : obj
                )
              )
              break
          }

          // Apply attention states after the last action completes
          if (index === actions.length - 1) {
            // Small delay to ensure all state updates are applied
            setTimeout(() => {
              setGraphObjects((prev) =>
                applyAttention({
                  objects: prev,
                  addedIds,
                  updatedIds,
                })
              );
            }, 50);
          }
        }, delay);

        actionTimersRef.current.push(timer);
      });

      // Set up auto-advance based on audio duration (on first step steps.length may be 1 while rest stream in)
      const lastActionDelay = TIMING_CONFIG.BASE_DELAY + ((actions.length - 1) * TIMING_CONFIG.STAGGER_DELAY);
      const lastWhiteboardDelay = whiteboardLines.length > 0 
        ? TIMING_CONFIG.WHITEBOARD_FIRST_DELAY + ((whiteboardLines.length - 1) * TIMING_CONFIG.WHITEBOARD_STAGGER_DELAY)
        : 0;
      const totalStepDuration = Math.max(audioTiming.estimatedDuration, lastActionDelay, lastWhiteboardDelay);
      const hasNext = stepIndex + 1 < steps.length || steps.length === 1;
      setupAutoAdvance(totalStepDuration, step.pauseDuration, hasNext);
    }).catch((error) => {
      console.error('Error handling subtitle:', error);
      // Fallback: execute actions immediately if audio fails
      const actions = step.actions ?? [];
      const addedIds: string[] = [];
      const updatedIds: string[] = [];
      
      // Fallback: add whiteboard lines immediately if audio fails
      const whiteboardLines = step.whiteboardLines ?? [];
      if (whiteboardLines.length > 0) {
        setWhiteboardLines(prev => [...prev, ...whiteboardLines]);
      }
      
      for (const action of actions) {
        switch (action.type) {
          case 'add':
            setGraphObjects(prev => [...prev, action.object])
            addedIds.push(action.object.id)
            break
          case 'remove':
            setGraphObjects(prev => prev.filter(obj => obj.id !== action.id))
            break
          case 'update':
            setGraphObjects(prev =>
              prev.map(obj =>
                obj.id === action.id
                  ? { ...obj, props: { ...obj.props, ...action.props } }
                  : obj
              )
            )
            updatedIds.push(action.id)
            break
        }
      }
      
      setGraphObjects((prev) =>
        applyAttention({
          objects: prev,
          addedIds,
          updatedIds,
        })
      );
    });

    return () => {
      // Cleanup: clear all action timers
      actionTimersRef.current.forEach(timer => clearTimeout(timer));
      actionTimersRef.current = [];
    };
    
  }, [stepIndex, steps, setGraphObjects, setSubtitle, setCameraTarget, setWhiteboardLines, setStepIndex, setSceneConfig])

  
  // cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        if (audioEndedHandlerRef.current) {
          audioRef.current.removeEventListener('ended', audioEndedHandlerRef.current);
          audioEndedHandlerRef.current = null;
        }
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      // Clear all timers
      actionTimersRef.current.forEach(timer => clearTimeout(timer));
      actionTimersRef.current = [];
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }
    }
  }, [])


}