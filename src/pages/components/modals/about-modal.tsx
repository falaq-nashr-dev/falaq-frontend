import { Drawer } from "vaul";

interface AboutModalProps {
  open: boolean;
  handleClose: () => void;
  about: string;
}

const AboutModal = ({ handleClose, open, about }: AboutModalProps) => {
  return (
    <div>
      <Drawer.Root onClose={handleClose} open={open} onOpenChange={handleClose}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-gray-100 flex flex-col items-center rounded-t-[10px] mt-24 h-fit fixed bottom-0 left-0 right-0 outline-none z-[200] max-w-xl mx-auto">
            <Drawer.Title className="hidden"></Drawer.Title>
            <Drawer.Description className="hidden"></Drawer.Description>

            <div className="w-full p-4 bg-white rounded-t-[10px]">
              {/* Handle Drawer */}
              <div
                aria-hidden
                className="mx-auto w-12 h-1.5 rounded-full bg-gray-300 mb-6"
              />
              <div className="min-h-[300px] max-h-[80vh] overflow-y-auto text-justify">
                {about}
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
};

export default AboutModal;
