import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import MainView from "./MainView";
import { resolveTestTimeline } from "./resolveTestTimeline";
import { useTimelineStream } from "./useTimelineStream";
import type { Step } from "../math/types/steps";

type Props = { prompt: string; onNewChat: () => void };

export default function TeachingView({ prompt, onNewChat }: Props) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showGraph, setShowGraph] = useState(true);
  const [showWhiteboard, setShowWhiteboard] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [subtitle, setSubtitle] = useState(" ");

  const testSteps = resolveTestTimeline(prompt);
  const isTest = testSteps !== null;
  const { steps, done } = useTimelineStream(isTest ? "" : prompt, onNewChat);

  const displayedSteps = testSteps ?? steps;
  const displayedDone = isTest ? true : done;
  return (
    <div className="h-full flex flex-col">
      <TopBar
        onNewChat={onNewChat}
        toggleSidebar={() => setShowSidebar((v) => !v)}
        toggleGraph={() => setShowGraph((v) => !v)}
        toggleWhiteboard={() => setShowWhiteboard((v) => !v)}
        toggleExplanation={() => setShowExplanation((v) => !v)}
      />

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showSidebar ? "w-72" : "w-0"
          }`}
        >
          <div
            className={`h-full transition-transform duration-300 ease-in-out ${
              showSidebar ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar />
          </div>
        </div>

        {displayedSteps ? (
          <MainView
            prompt={prompt}
            showGraph={showGraph}
            showWhiteboard={showWhiteboard}
            showExplanation={showExplanation}
            setSubtitle={setSubtitle}
            subtitle={subtitle}
            steps={displayedSteps}
            done={displayedDone}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-neutral-950">
            <div className="text-center">
              <div className="text-neutral-400 text-lg mb-2">
                Generating animation timeline...
              </div>
              <div className="text-neutral-500 text-sm">
                Please wait while the AI creates your visualization
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}