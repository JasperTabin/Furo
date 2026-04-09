//The shell that wraps the dashboard — provides the navbar and the scrollable content area.

import { type ReactNode } from "react";
import { Nav } from "../shared/components/Nav";

interface LayoutProps {
  children: ReactNode;
  onResetLayout: () => void;
  onOpenKanbanPage: () => void;
  onHome: () => void;
}

export function Layout({
  children,
  onResetLayout,
  onOpenKanbanPage,
  onHome,
}: LayoutProps) {
  return (
    <div className="h-dvh overflow-hidden bg-(--color-bg) text-(--color-fg) transition-colors duration-500">
      <Nav
        onResetLayout={onResetLayout}
        onOpenKanbanPage={onOpenKanbanPage}
        onTitleClick={onHome}
      />

      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-4 pb-26 sm:px-6 sm:py-6 sm:pb-28 lg:px-8">
            <div className="w-full">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
