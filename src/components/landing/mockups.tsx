import type { ReactNode } from "react";
import { X, Shuffle, SkipBack, Play, SkipForward, Volume2 } from "lucide-react";

// ── Shared Container ─────────────────────────────────────────────────── (Done)
function MockShell({ children }: { children: ReactNode }) {
  return (
    <div className="card-base w-full h-64 sm:h-104 flex items-center justify-center overflow-hidden">
      <div className="w-full p-6">{children}</div>
    </div>
  );
}

// ── Pomodoro ─────────────────────────────────────────────────── (Done)
export function MockPomodoro() {
  return (
    <MockShell>
      <div className="space-y-3">
        <div className="border border-(--color-border) rounded-lg p-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="font-mono text-xs text-(--color-fg)">CLASSIC</span>
            <span className="font-mono text-xs text-(--color-fg)">
              Count down
            </span>
          </div>
          <div className="font-mono font-bold text-4xl tracking-tight">
            25:00
          </div>
        </div>

        <div className="border border-(--color-border) rounded-lg p-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="font-mono text-xs text-(--color-fg)">REVERSE</span>
            <span className="font-mono text-xs text-(--color-fg)">
              Count up
            </span>
          </div>
          <div className="font-mono font-bold  text-4xl tracking-tight">
            00:00
          </div>
        </div>
      </div>
    </MockShell>
  );
}

// ── Todo-List ────────────────────────────────────────────────────────── (Done)
export function MockKanban() {
  return (
    <MockShell>
      <p className="font-serif text-lg text-center mb-4">Kanban Board</p>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "TO DO", count: 3, cards: ["Design landing page", "Review PR #234", "Update docs"] },
          { label: "DOING", count: 2, cards: ["Ship v1.2 release", "Fix auth bug"] },
          { label: "DONE", count: 3, cards: ["Team standup", "Deploy to prod", "Write tests"] },
        ].map((col) => (
          <div
            key={col.label}
            className="border border-(--color-border) rounded-lg p-2.5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs tracking-widest text-(--color-fg)">
                {col.label}
              </span>
              <span className="font-mono text-xs text-(--color-fg)">
                {col.count}
              </span>
            </div>
            {col.cards.map((card) => (
              <div
                key={card}
                className="bg-(--color-fg)/5 rounded px-1.5 py-1 text-xs text-(--color-fg) mb-1"
              >
                {card}
              </div>
            ))}
          </div>
        ))}
      </div>
    </MockShell>
  );
}

// ── Calendar ────────────────────────────────────────────────────────── (Done)
export function MockCalendar() {
  return (
    <MockShell>
      <div className="grid grid-cols-7 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={`${d}-${i}`} className="text-base text-(--color-fg)">
            {d}
          </div>
        ))}
        {Array.from({ length: 35 }, (_, i) => (
          <div
            key={i}
            className="aspect-square flex items-center justify-center rounded-md text-sm text-(--color-fg)"
          >
            {i < 3 ? "" : i > 32 ? "" : i - 2}
          </div>
        ))}
      </div>
    </MockShell>
  );
}

// ── Music Player ─────────────────────────────────────────────────── (Done)
export function MockMusic() {
  return (
    <MockShell>
      <div className="max-w-80 mx-auto w-full border border-(--color-border) rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium ">Study with Me</p>
            <p className="text-xs text-(--color-fg)">Ambient Waves</p>
          </div>
          <span aria-hidden="true" className="text-(--color-fg)">
            <X size={14} />
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span aria-hidden="true" className="text-(--color-fg)">
            <Shuffle size={13} />
          </span>
          <span aria-hidden="true" className="text-(--color-fg)">
            <SkipBack size={14} />
          </span>
          <span
            aria-hidden="true"
            className="w-9 h-9 rounded-full border border-(--color-border) flex items-center justify-center"
          >
            <Play size={13} />
          </span>
          <span aria-hidden="true" className="text-(--color-fg)">
            <SkipForward size={14} />
          </span>
          <span className="font-mono text-[9px] text-(--color-fg)">1/11</span>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 size={14} className="text-(--color-fg)" />
          <div className="flex-1 h-0.5 rounded-full bg-(--color-border) relative">
            <div className="absolute inset-y-0 left-0 w-4/5 bg-(--color-fg) rounded-full" />
          </div>
          <span className="text-xs text-(--color-fg) w-5 text-right">80</span>
        </div>
      </div>
    </MockShell>
  );
}

// ── Mini Pomodoro ─────────────────────────────────────────────────── (Done)
export function MockMiniPlayer() {
  return (
    <MockShell>
      <div className="relative flex items-center justify-center min-h-32 sm:min-h-72">
        <p className="font-serif text-base sm:text-2xl italic text-(--color-fg) text-center">
          Sample Application
        </p>

        <div className="absolute left-55 -bottom-10 sm:left-70 sm:top-64 border border-(--color-border) rounded-lg bg-(--color-fg)/5 p-2">
          <div className="font-mono font-bold text-center text-base mb-1">
            25:00
          </div>
          <div className="flex justify-center">
            <div className="w-12 text-center text-xs font-medium py-1 px-1 border border-(--color-border) rounded">
              START
            </div>
          </div>
        </div>

      </div>
    </MockShell>
  );
}
