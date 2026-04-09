import {
  Kanban,
  Moon,
  RotateCcw,
  Sun,
  SwatchBook,
} from "lucide-react";
import { PALETTE_OPTIONS, useTheme } from "../hooks/useTheme";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NavProps {
  onResetLayout: () => void;
  onOpenKanbanPage: () => void;
  onTitleClick: () => void;
}

export const Nav = ({
  onResetLayout,
  onOpenKanbanPage,
  onTitleClick,
}: NavProps) => {
  const { mode, palette, setPalette, setTheme } = useTheme();
  const isDark = mode === "dark";

  return (
    <TooltipProvider delayDuration={300}>
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 -translate-x-1/2 sm:bottom-5">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-(--color-border)/70 bg-(--color-bg)/90 p-1.5 shadow-xl backdrop-blur-xl">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onTitleClick}
                aria-label="Home"
                className="h-10 w-10 rounded-full text-(--color-fg) hover:bg-(--color-border)/30"
              >
                <span className="text-sm font-bold tracking-widest">F</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Home</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenKanbanPage}
                aria-label="Kanban board"
                className="h-10 w-10 rounded-full text-(--color-fg) hover:bg-(--color-border)/30"
              >
                <Kanban size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Kanban board</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onResetLayout}
                aria-label="Reset layout"
                className="h-10 w-10 rounded-full text-(--color-fg) hover:bg-(--color-border)/30"
              >
                <RotateCcw size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Reset layout</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className="h-10 w-10 rounded-full text-(--color-fg) hover:bg-(--color-border)/30"
              >
                {isDark ? <Moon size={18} /> : <Sun size={18} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {isDark ? "Switch to light mode" : "Switch to dark mode"}
            </TooltipContent>
          </Tooltip>

          <Popover>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Theme palette"
                    className="h-10 w-10 rounded-full text-(--color-fg) hover:bg-(--color-border)/30"
                  >
                    <SwatchBook size={18} />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent side="top">Theme palette</TooltipContent>
            </Tooltip>
            <PopoverContent
              side="top"
              align="end"
              sideOffset={10}
              className="w-auto border-(--color-border) bg-(--color-bg) p-2.5"
            >
              <div className="flex flex-col gap-2">
                {PALETTE_OPTIONS.map((option) => {
                  const isActive = palette === option.id;
                  const previewBackground = isDark ? option.dark : option.light;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setPalette(option.id)}
                      className={[
                        "h-8 w-8 rounded-full border transition-all",
                        isActive
                          ? "border-(--color-fg)"
                          : "border-(--color-border) hover:border-(--color-fg)/50",
                      ].join(" ")}
                      style={{ background: previewBackground }}
                      aria-label={`Use ${option.label} palette`}
                      title={option.label}
                    />
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </TooltipProvider>
  );
};
