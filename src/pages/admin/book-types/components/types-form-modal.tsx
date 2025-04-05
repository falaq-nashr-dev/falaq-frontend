import { useRef, useState } from "react";
import { Drawer } from "vaul";
import { Request } from "../../../../helpers/Request";
import toast from "react-hot-toast";
import { useBookTypesStore } from "../../../../store/admin/useBookTypesStore";

interface TypesFormModalProps {
  open: boolean;
  handleClose: () => void;
  refresh: () => Promise<void>;
}

const TypesFormModal = ({
  handleClose,
  open,
  refresh,
}: TypesFormModalProps) => {
  //
  const { editingId, setEditingId, name, setName } = useBookTypesStore();
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    handleClose();
    setName("");
    setEditingId("");
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Bo'sh maydonni kiriting");
      inputRef.current?.focus();
      return;
    }
    setLoading(true);

    const isEditing = editingId !== "";
    const endpoint = isEditing ? `/product-type/${editingId}` : "/product-type";
    const method = isEditing ? "PUT" : "POST";

    try {
      await Request(endpoint, method, { name }, true);
      handleClear();
      refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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

            <div className="w-full p-4 bg-white rounded-t-[10px]">
              {/* Handle Drawer */}
              <div>
                <p className="text-lg font-medium text-center">Tur yaratish</p>
                <div className="mt-2 py-3 px-1 ">
                  <div className=" w-full">
                    <label htmlFor="name" className="font-medium mb-1">
                      Tur nomi
                    </label>
                    <input
                      ref={inputRef}
                      disabled={loading}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                      placeholder="tur nomi..."
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-x-3">
                <button
                  onClick={handleClear}
                  className={` group bg-[#EFEEF0] focus:ring-1 focus:outline-none focus:ring-blue-300  rounded-lg  px-[16px] py-[7px] text-center relative overflow-hidden hover:opacity-80 flex items-center gap-x-2  justify-center mt-5 w-full`}
                >
                  bekor qilish
                </button>
                <button
                  disabled={loading}
                  onClick={handleSave}
                  className={`text-white group bg-[#2473F2] focus:ring-1 focus:outline-none focus:ring-blue-300  rounded-lg  px-[16px] py-[7px] text-center relative overflow-hidden hover:opacity-80 flex items-center gap-x-2  justify-center mt-5 w-full`}
                >
                  {loading ? "saqlanmoqda..." : "saqlash"}
                </button>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
};

export default TypesFormModal;
