"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import type { ChatBlock } from "../math/timeline/TimelineController";
import { nextSentenceEnd } from "./chatBlockUtils";

type Props = {
  /** User's question; shown as the panel header instead of "Narration". */
  prompt: string;
  chatBlocks: ChatBlock[];
  currentStepWhiteboardLines: string[];
  /** 0-based char index in subtitle after which each whiteboard line appears (same order as currentStepWhiteboardLines). When provided, equations pop up exactly when the narration reaches that point. */
  currentStepWhiteboardAtIndices?: number[];
  subtitle: string;
  subtitleProgress: number; // 0–1, driven by TTS playback
};

function WhiteboardBlock({ latex }: { latex: string }) {
  const html = (() => {
    try {
      return katex.renderToString(latex, { throwOnError: false, displayMode: true });
    } catch {
      return "";
    }
  })();
  if (!html) return null;
  return (
    <div className="my-3 w-full flex justify-center animate-whiteboard-in">
      <div
        className="text-zinc-100 [&_.katex]:text-[1.25rem] [&_.katex-display]:my-1"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

export default function SubtitleChatPanel({
  prompt,
  chatBlocks,
  currentStepWhiteboardLines,
  currentStepWhiteboardAtIndices,
  subtitle,
  subtitleProgress,
}: Props) {
  const len = subtitle.length;
  const progress = Math.max(0, Math.min(1, subtitleProgress));
  const visibleExact = len === 0 ? 0 : progress * len;
  const fullCount = Math.floor(visibleExact);
  const frac = visibleExact - fullCount;
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const n = currentStepWhiteboardLines.length;
  const useAtIndices =
    currentStepWhiteboardAtIndices != null &&
    currentStepWhiteboardAtIndices.length === n &&
    currentStepWhiteboardAtIndices.every((i) => i >= 0 && i <= len);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || !bottomRef.current) return;
    const threshold = 80;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    if (atBottom) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatBlocks.length, progress, subtitle]);

  // Current message: text and whiteboard in order. When useAtIndices, each equation
  // pops up when visibleExact >= that char index (narration just said it). Otherwise equal split.
  const renderCurrentMessage = () => {
    if (n === 0) {
      const displayed = subtitle.slice(0, fullCount);
      const nextChar = fullCount < len ? subtitle[fullCount] : "";
      const hasCurrentText = displayed.length > 0 || nextChar || subtitle.trim().length > 0;
      const stillTyping = visibleExact < len && len > 0;
      return (
        <p className="text-[15px] text-zinc-100 leading-[1.6] whitespace-pre-wrap">
          {hasCurrentText ? (
            <span className="inline">
              {displayed}
              {nextChar ? (
                <span className="inline" style={{ opacity: frac }}>
                  {nextChar}
                </span>
              ) : null}
              {stillTyping && (
                <span
                  className="inline align-middle text-zinc-500 animate-pulse"
                  style={{ marginLeft: "2px" }}
                  aria-hidden
                >
                  |
                </span>
              )}
            </span>
          ) : chatBlocks.length === 0 ? (
            " "
          ) : null}
        </p>
      );
    }

    // When using atIndices, sort by index and snap each to end of sentence so equations never cut mid-sentence.
    const sorted =
      useAtIndices && currentStepWhiteboardAtIndices
        ? currentStepWhiteboardAtIndices
            .map((idx, i) => ({
              displayAt: nextSentenceEnd(subtitle, idx),
              latex: currentStepWhiteboardLines[i],
            }))
            .sort((a, b) => a.displayAt - b.displayAt)
        : null;
    const breakPoints: number[] =
      sorted != null
        ? [0, ...sorted.map((s) => s.displayAt), len]
        : Array.from({ length: n + 2 }, (_, i) => Math.round((i / (n + 1)) * len));
    const whiteboardLatexBySegment =
      sorted != null ? sorted.map((s) => s.latex) : currentStepWhiteboardLines;

    const segments: React.ReactNode[] = [];
    for (let i = 0; i <= n; i++) {
      const segmentStart = breakPoints[i];
      const segmentEnd = Math.max(breakPoints[i + 1], segmentStart);
      const visibleEnd = Math.min(segmentEnd, visibleExact);
      const segmentFullCount = Math.floor(visibleEnd);
      const segmentFrac = visibleEnd - segmentFullCount;
      const segmentDisplayed = subtitle.slice(segmentStart, segmentFullCount);
      const segmentNextChar =
        segmentFullCount < segmentEnd && segmentFullCount < len ? subtitle[segmentFullCount] : "";
      const showWhiteboardAfter = i < n && visibleExact >= breakPoints[i + 1];

      if (segmentStart < len) {
        segments.push(
          <p key={`seg-${i}`} className="text-[15px] text-zinc-100 leading-[1.6] whitespace-pre-wrap">
            {segmentDisplayed}
            {segmentNextChar ? (
              <span style={{ opacity: segmentFrac }}>{segmentNextChar}</span>
            ) : null}
          </p>
        );
      }
      if (showWhiteboardAfter) {
        segments.push(
          <WhiteboardBlock key={`wb-${i}`} latex={whiteboardLatexBySegment[i]} />
        );
      }
    }
    const stillTyping = visibleExact < len && len > 0;
    return (
      <div className="flex flex-col gap-0">
        {segments}
        {stillTyping && (
          <span
            className="inline align-middle text-zinc-500 animate-pulse"
            style={{ marginLeft: "2px" }}
            aria-hidden
          >
            |
          </span>
        )}
      </div>
    );
  };

  const hasPrompt = prompt.trim().length > 0;

  return (
    <div
      className="flex flex-col w-full h-full min-h-0 relative"
      style={{
        background: `
          radial-gradient(circle at 50% 50%, rgba(255,255,255,0.008) 1px, transparent 1px),
          radial-gradient(ellipse 100% 90% at 50% 40%, #252528 0%, #1a1a1d 45%, #111113 100%)
        `,
        backgroundSize: "32px 32px, 100% 100%",
        backgroundPosition: "0 0, 0 0",
      }}
    >
      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-6 py-8"
      >
        <div className="flex flex-col gap-7 max-w-2xl relative pl-6 border-l border-zinc-600/50">
          {/* User question — very subtle */}
          {hasPrompt && (
            <div className="flex justify-end">
              <div
                className="rounded-xl px-3.5 py-2.5 bg-zinc-800/25 border border-zinc-700/15 text-zinc-500 text-[14px] leading-relaxed max-w-[85%]"
                title={prompt}
              >
                {prompt.trim()}
              </div>
            </div>
          )}
          {/* Assistant responses */}
          {chatBlocks.map((block, i) => (
            <div key={i} className="flex gap-4">
              {block.type === "subtitle" && block.text.length > 0 && (
                <>
                  <div className="shrink-0 w-9 h-9 rounded-full bg-zinc-700/60 flex items-center justify-center text-zinc-300 text-[13px] font-medium">
                    M
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-[15px] text-zinc-200/95 leading-[1.62] whitespace-pre-wrap">
                      {block.text}
                    </p>
                  </div>
                </>
              )}
              {block.type === "whiteboard" && (
                <>
                  <div className="shrink-0 w-9" />
                  <div className="min-w-0 flex-1">
                    <WhiteboardBlock latex={block.latex} />
                  </div>
                </>
              )}
            </div>
          ))}
          {/* Current message */}
          <div className="flex gap-4">
            <div className="shrink-0 w-9 h-9 rounded-full bg-zinc-700/60 flex items-center justify-center text-zinc-300 text-[13px] font-medium">
              M
            </div>
            <div className="min-w-0 flex-1 pt-0.5">{renderCurrentMessage()}</div>
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
