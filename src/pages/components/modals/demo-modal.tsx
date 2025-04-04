import { CgClose } from "react-icons/cg";
import { Drawer } from "vaul";
import { BookPage } from "../../../types";
import { useEffect, useState } from "react";
import { Request } from "../../../helpers/Request";

interface DemoModalProps {
  open: boolean;
  handleClose: () => void;
  currentBookId: string;
}

const DemoModal = ({ handleClose, open, currentBookId }: DemoModalProps) => {
  const [bookPages, setBookPages] = useState<BookPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBookPage, setSelectedBookPage] = useState<BookPage | null>(
    null
  );
  const [selectedId, setSelectedId] = useState<string>("");

  const fetchCurrentBookPages = async () => {
    try {
      setLoading(true);
      const { data } = await Request<BookPage[]>(
        `/book-pages/by-book/${currentBookId}`,
        "GET",
        {},
        true
      );
      setBookPages(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentBookPages();
  }, [currentBookId]);

  // When bookPages update, set the first page as the selected one (if available)
  useEffect(() => {
    if (bookPages.length > 0) {
      setSelectedBookPage(bookPages[0]);
      setSelectedId(bookPages[0].id);
    }
  }, [bookPages]);

  if (loading) {
    return <div>Yuklanmoqda...</div>;
  }

  return (
    <div>
      <Drawer.Root onClose={handleClose} open={open} onOpenChange={handleClose}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-gray-100 flex flex-col items-center rounded-t-[10px] mt-24 h-fit fixed bottom-0 left-0 right-0 outline-none z-[200]">
            <Drawer.Title className="hidden"></Drawer.Title>
            <Drawer.Description className="hidden"></Drawer.Description>

            <div className="w-full p-4 bg-white rounded-t-[10px] relative">
              {/* Handle Drawer */}
              <button
                onClick={handleClose}
                className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-gray-50 absolute top-1 right-1 group"
              >
                <CgClose className="size-4 group-hover:text-blue-500" />
              </button>
              <div
                aria-hidden
                className="mx-auto w-12 h-1.5 rounded-full bg-gray-300 mb-6"
              />
              <div className="h-[87vh] overflow-y-auto relative">
                <div className="h-[80vh] overflow-y-auto">
                  {selectedBookPage ? (
                    <p className="text-justify">{selectedBookPage.content}</p>
                  ) : (
                    <p>Sahifa topilmadi</p>
                  )}
                </div>

                {/* Pagination */}
                <div className="inline-flex rounded-xl absolute bottom-0 left-1/2 -translate-x-1/2 overflow-x-auto max-w-[360px]    px-2 scrollbar-hide ">
                  <ul className="flex items-center gap-x-1">
                    {bookPages.map((bookPage, ind) => (
                      <li
                        key={bookPage.id}
                        onClick={() => {
                          setSelectedBookPage(bookPage);
                          setSelectedId(bookPage.id);
                        }}
                      >
                        <button
                          className={`w-9 h-9 rounded-md border hover:border-cyan-500 hover:text-blue-500 text-blue-500 ${
                            bookPage.id === selectedId
                              ? "bg-blue-500 hover:text-white text-white"
                              : ""
                          }`}
                        >
                          {ind + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
};

export default DemoModal;
