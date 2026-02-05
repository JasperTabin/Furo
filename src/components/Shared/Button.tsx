import type { ReactNode } from "react";

// All Buttons & ThemeToggle Button Variant
type ButtonVariant =
  | "active"
  | "inactive"
  | "danger"
  | "themeTrigger"
  | "themeItem"
  | "themeItemActive";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  className?: string;
  ariaLabel?: string;
  title?: string;
}

// All the Button Styles
const baseButtonClass = `
  px-3 sm:px-6 py-2 sm:py-3
  text-xs sm:text-sm font-medium tracking-wide
  rounded-md
  border
  transition
  focus:outline-none
  focus:ring-2 focus:ring-[var(--color-fg)]/40
`;

const variants: Record<ButtonVariant, string> = {
  active: `
    ${baseButtonClass}
    bg-[var(--color-fg)]
    text-[var(--color-bg)]
    border-[var(--color-fg)]
    hover:brightness-90
  `,
  inactive: `
    ${baseButtonClass}
    bg-transparent
    text-[var(--color-fg)]/70
    border-[var(--color-border)]
    hover:text-[var(--color-fg)]
    hover:border-[var(--color-fg)]/60
    hover:bg-[var(--color-fg)]/5
  `,
  danger: `
    ${baseButtonClass}
    text-red-500
    border border-red-500/40
    hover:bg-red-500/10
  `,

  // ThemeToggle Specific Button
  themeTrigger: `
    flex items-center gap-2 p-2 rounded-md
    hover:bg-[var(--color-border)]/20
    transition-colors
  `,
  themeItem: `
    flex items-center gap-3 px-4 py-3
    hover:bg-[var(--color-border)]/20
    transition-colors cursor-pointer
  `,
  themeItemActive: `
    flex items-center gap-3 px-4 py-3
    bg-[var(--color-border)]/30 cursor-pointer
  `,
};

export const Button = ({
  children,
  onClick,
  variant = "inactive",
  className = "",
  ariaLabel,
  title,
}: ButtonProps) => {
  const classes = `${variants[variant]} ${className}`;

  //   Theme Toggle Button
  if (variant === "themeItem" || variant === "themeItemActive") {
    return (
      <div onClick={onClick} className={classes} role="menuitem">
        {children}
      </div>
    );
  }

  // All Buttons
  return (
    <button
      onClick={onClick}
      className={classes}
      aria-label={ariaLabel}
      title={title}
    >
      {children}
    </button>
  );
};
