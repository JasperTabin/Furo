// Reusable modal container with backdrop and centered content box

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal = ({
  isOpen,
  children,
  maxWidth = "max-w-md",
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-(--color-bg)/30">
      <div
        className={`w-full ${maxWidth} bg-(--color-bg) border border-(--color-border) rounded-2xl shadow-2xl overflow-hidden`}
      >
        {children}
      </div>
    </div>
  );
};