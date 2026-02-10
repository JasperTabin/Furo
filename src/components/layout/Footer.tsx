import { Copyright } from "lucide-react";

interface FooterProps {
  footerRef?: React.RefObject<HTMLDivElement | null>;
}

export const Footer = ({ footerRef }: FooterProps) => {
  return (
    <footer
      ref={footerRef}
      className="text-[10px] sm:text-xs tracking-wide flex items-center justify-center gap-2 mt-auto text-(--color-border) opacity-60"
    >
      <Copyright size={12} />
      2026 JasDev. All rights reserved.
    </footer>
  );
};
