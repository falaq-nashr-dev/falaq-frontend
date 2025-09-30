import { useEffect, useState } from "react";
import ContentModal from "./content-modal";
import { useNavigate, useParams } from "react-router-dom";
import { Request } from "../../../../helpers/Request";
import { BookPage } from "../../../../types";
import { AiOutlineClose } from "react-icons/ai";
import BookPagesModal from "./book-pages-modal";
import toast from "react-hot-toast";
import { IoChevronBack } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { useBookPagesStore } from "../../../../store/admin/useBookPagesStore";

const OneBookPageData = () => {
  //
  const { setEditingId, open, setOpen, setContent, setPageNumber } =
    useBookPagesStore();
  const params = useParams();
  const navigate = useNavigate();

  const [bookPages, setBookPages] = useState<BookPage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCurrentBookPages();
  }, []);

  const fetchCurrentBookPages = async () => {
    try {
      setLoading(true);
      const { data } = await Request<BookPage[]>(
        `/book-pages/by-book/${params?.id}`,
        "GET",
        {},
        true
      );
      const sortedPages = data.sort((a, b) => a.pageNumber - b.pageNumber);
      setBookPages(sortedPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const [currentContent, setCurrentContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const showContent = (content: string) => {
    setCurrentContent(content);
    setIsOpen(true);
  };

  const handleDeleteBookPage = async (bookPageId: string) => {
    try {
      await Request(`/book-pages/${bookPageId}`, "DELETE", {}, true);
      fetchCurrentBookPages();
    } catch (error) {
      console.log(typeof error);
      toast.error("Xatolik yuz berdi");
    }
  };

  const handleEdit = (bookPage: BookPage) => {
    setEditingId(bookPage.id);
    setContent(bookPage.content);
    setPageNumber(bookPage.pageNumber + "");
    setOpen(true);
  };

  return (
    <div
      className={`overflow-x-auto ${
        loading ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <div className="flex justify-between mb-2">
        <div className="flex items-center gap-x-3">
          <button
            onClick={() => navigate(-1)}
            className="relative flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg  hover:bg-gray-50  "
          >
            <IoChevronBack className="size-4" />
            Orqaga
          </button>
          <h4>Betlar soni: {bookPages?.length} ta</h4>
        </div>
        <button
          onClick={() => setOpen(true)}
          type="button"
          className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-1 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none "
        >
          + yangi
        </button>{" "}
      </div>
      <table className=" w-full  rounded-xl">
        <thead>
          <tr className="bg-gray-50">
            <th
              scope="col"
              className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-tl-xl"
            >
              №
            </th>
            <th
              scope="col"
              className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
            >
              Book name
            </th>
            <th
              scope="col"
              className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
            >
              Book Author
            </th>
            <th
              scope="col"
              className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
            >
              Book Page Number
            </th>
            <th
              scope="col"
              className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
            >
              Book Content
            </th>

            <th
              scope="col"
              className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {loading && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-700">
                Loading...
              </td>
            </tr>
          )}
          {!loading && bookPages?.length <= 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-700">
                No data found
              </td>
            </tr>
          )}
          {bookPages.map((bookPage, ind) => (
            <tr
              key={ind}
              className="bg-white transition-all duration-500 hover:bg-gray-50"
            >
              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 ">
                {ind + 1}
              </td>
              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                {bookPage.book.name}
              </td>
              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                {bookPage.book.author.fullName}
              </td>
              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                {bookPage.pageNumber}-bet
              </td>
              <td className="p-5 whitespace-nowrap  text-wrap line-clamp-3 text-sm leading-6 font-medium text-gray-900 max-w-[200px]">
                <button
                  onClick={() => showContent(bookPage.content)}
                  className="py-2.5 px-3 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-1 focus:ring-gray-100 "
                >
                  o'qish
                </button>
              </td>

              <td className=" p-5 ">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDeleteBookPage(bookPage.id)}
                    className="p-2 rounded-full  group transition-all duration-500  flex item-center hover:text-red-600 hover:bg-gray-100"
                  >
                    <AiOutlineClose size={20} />
                  </button>
                  <button
                    onClick={() => handleEdit(bookPage)}
                    className="p-2 rounded-full  group transition-all duration-500  flex item-center hover:text-blue-600 hover:bg-gray-100"
                  >
                    <MdModeEdit size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <ContentModal
          content={currentContent}
          handleClose={() => setIsOpen(false)}
          open={isOpen}
        />
      </div>
      <div>
        <BookPagesModal
          refresh={fetchCurrentBookPages}
          handleClose={() => setOpen(false)}
          open={open}
        />
      </div>
    </div>
  );
};

export default OneBookPageData;
