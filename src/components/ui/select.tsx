import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { hideIcon?: boolean }
>(({ className, children, hideIcon = false, ...props }, ref) => (
  <div className="relative">
    <select
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-(--color-border) bg-transparent px-3 py-2 text-sm text-(--color-fg) shadow-sm placeholder:text-(--color-fg)/40 focus:outline-none focus:ring-1 focus:ring-(--color-fg)/20 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
    {!hideIcon && (
      <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none" />
    )}
  </div>
))
Select.displayName = "Select"

export { Select }
