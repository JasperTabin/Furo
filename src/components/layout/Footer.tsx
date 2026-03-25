import { Copyright } from "lucide-react";

interface FooterProps {
  footerRef?: React.RefObject<HTMLDivElement | null>;
}

export const Footer = ({ footerRef }: FooterProps) => {
  return (
    <footer
      ref={footerRef}
      className="text-[10px] sm:text-sm flex items-center justify-center gap-2 mt-auto text-(--color-fg)/50"
    >
      <Copyright size={14} />
      2026 JasDev. All rights reserved.
    </footer>
  );
};
