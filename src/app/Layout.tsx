import { type ReactNode } from "react";
import { Header } from "../shared/components/Header";
import MusicPlayer from "../features/music-player/MusicPlayer";
import { useFullscreen } from "../features/timer/hooks/useFullscreen";
import { type AppView } from "./Page";

interface LayoutProps {
  children: ReactNode;
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onHome: () => void;
}

export function Layout({
  children,
  currentView,
  onViewChange,
  onHome,
}: LayoutProps) {
  const { isFullscreen } = useFullscreen();

  return (
    <div
      className={[
        "h-dvh overflow-hidden flex flex-col transition-colors duration-500",
        "bg-(--color-bg) text-(--color-fg)",
        isFullscreen ? "" : "p-6 sm:p-8",
      ].join(" ")}
    >
      {!isFullscreen && (
        <Header
          currentView={currentView}
          onViewChange={onViewChange}
          onTitleClick={onHome}
        />
      )}

      <main className="flex-1 flex flex-col overflow-x-hidden">{children}</main>

      <MusicPlayer />
    </div>
  );
}
