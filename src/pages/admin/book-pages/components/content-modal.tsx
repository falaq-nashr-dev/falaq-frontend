import { Drawer } from "vaul";

interface ContentModalProps {
  open: boolean;
  handleClose: () => void;
  content: string;
}

const ContentModal = ({ handleClose, open, content }: ContentModalProps) => {
  return (
    <div>
      <Drawer.Root
        direction="right"
        dismissible={false}
        onClose={handleClose}
        open={open}
        onOpenChange={handleClose}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content
            className="right-2 top-2 bottom-2 fixed z-10 outline-none min-w-[390px] flex"
            style={
              {
                "--initial-transform": "calc(100% + 8px)",
              } as React.CSSProperties
            }
          >
            <Drawer.Title className="hidden"></Drawer.Title>
            <Drawer.Description className="hidden"></Drawer.Description>

            <div className="w-full max-w-[400px] p-4 bg-white rounded-t-[10px]">
              {/* Handle Drawer */}
              <div className="max-h-[80vh] overflow-y-auto text-justify">
                {content !== "" && content}
              </div>
              <div className="flex items-center gap-x-3">
                <button
                  onClick={handleClose}
                  className={` group bg-[#EFEEF0] focus:ring-1 focus:outline-none focus:ring-blue-300  rounded-lg  px-[16px] py-[7px] text-center relative overflow-hidden hover:opacity-80 flex items-center gap-x-2  justify-center mt-5 w-full`}
                >
                  yopish
                </button>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
};

export default ContentModal;
