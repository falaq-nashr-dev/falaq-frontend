import { Drawer } from "vaul";
import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalDrawerProps {
  isModal?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export default function ModalDrawer({
  isModal = false,
  open,
  onOpenChange,
  children,
}: ModalDrawerProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} shouldScaleBackground>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[100]" />
        <Drawer.Title></Drawer.Title>
        <Drawer.Description></Drawer.Description>

        <Drawer.Content
          className={`fixed z-[101] transition-all ${
            isModal
              ? "inset-0 flex items-center justify-center"
              : "bottom-0 left-0 right-0"
          }`}
        >
          <div
            className={`relative bg-white shadow-xl p-6 ${
              isModal
                ? "w-[500px] rounded-2xl"
                : "w-full max-w-md mx-auto rounded-t-2xl rounded-b-none"
            }`}
          >
            {/* Close button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute z-10 top-2 right-3 rounded-sm p-1 opacity-70 
                         transition-opacity hover:opacity-100 
                         focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>

            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
