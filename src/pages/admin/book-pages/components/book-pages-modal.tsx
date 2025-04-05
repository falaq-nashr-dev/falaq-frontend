import { useState } from "react";
import { Drawer } from "vaul";
import { Request } from "../../../../helpers/Request";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useBookPagesStore } from "../../../../store/admin/useBookPagesStore";

interface BookPagesModalProps {
  open: boolean;
  handleClose: () => void;
  refresh: () => Promise<void>;
}

const BookPagesModal = ({
  handleClose,
  open,
  refresh,
}: BookPagesModalProps) => {
  const {
    content,
    setContent,
    editingId,
    setEditingId,
    pageNumber,
    setPageNumber,
  } = useBookPagesStore();
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const handleClear = () => {
    handleClose();
    setContent("");
    setPageNumber("");
    setEditingId("");
  };

  const handleSave = async () => {
    if (!content.trim() || !pageNumber || !params?.id) {
      toast.error("Bo'sh maydonlarni kiriting");
      return;
    }

    setLoading(true);
    const isEditing = editingId !== "";
    const endpoint = isEditing ? `/book-pages/${editingId}` : "/book-pages";
    const method = isEditing ? "PUT" : "POST";
    const payload = {
      bookId: params?.id,
      pageNumber: parseInt(pageNumber),
      content,
    };

    try {
      await Request(endpoint, method, payload, true);
      handleClear();
      refresh();
    } catch (error) {
      console.log(error);
      toast.error("Xatolik yuz berdi");
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

            <div className="w-full p-4 bg-white rounded-t-[10px] overflow-y-auto">
              {/* Handle Drawer */}
              <div>
                <p className="text-lg font-medium text-center">
                  Kitob sahifasi yaratish
                </p>
                <div className="mt-2 py-3 px-1 ">
                  <div className="w-full mt-3">
                    <label htmlFor="page" className="font-medium mb-1">
                      Kitob beti
                    </label>
                    <input
                      value={pageNumber}
                      onChange={(e) => setPageNumber(e.target.value)}
                      type="number"
                      id="page"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                      placeholder="kitob betini kiriting..."
                    />
                  </div>
                  <div className="w-full mt-3">
                    <label htmlFor="definition" className="font-medium mb-1">
                      Sahifa ma'lumotlari
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      id="definition"
                      rows={15}
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:outline-blue-500"
                      placeholder="Sahifa ma'lumotini kiriting..."
                    ></textarea>
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

export default BookPagesModal;
