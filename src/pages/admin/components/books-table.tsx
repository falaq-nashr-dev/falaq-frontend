import { AiOutlineClose } from "react-icons/ai";
import { Request } from "../../../helpers/Request";
import { useEffect, useState } from "react";
import { AdminBooks } from "../../../types";
import toast from "react-hot-toast";

import { ImageViewer } from "react-image-viewer-dv";
import { getImage } from "../../../helpers/image";
import { MdModeEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useBookStore } from "../../../store/admin/useBookStore";

const BooksTable = () => {
  const [books, setBooks] = useState<AdminBooks[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setEditingId } = useBookStore();

  // Fetch books
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data } = await Request<AdminBooks[]>(
        `/products`,
        "GET",
        {},
        true
      );
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId: string) => {
    try {
      setLoading(true);
      await Request(`/products/${bookId}`, "DELETE", {}, true);
      toast.success("Muvaffaqiyatli");
      fetchBooks();
    } catch (error) {
      console.log(typeof error);
      toast("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book: AdminBooks) => {
    setEditingId(book.id);

    navigate("/admin/books/create", { state: book });
  };

  return (
    <div
      className={`overflow-x-auto max-w-6xl ${
        loading ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <table className="w-full rounded-xl">
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
              Image
            </th>
            <th
              scope="col"
              className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
            >
              Name
            </th>
            <th
              scope="col"
              className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
            >
              Author
            </th>

            <th
              scope="col"
              className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
            >
              Category
            </th>
            <th
              scope="col"
              className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
            >
              Price
            </th>
            <th
              scope="col"
              className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
            >
              Sale Price
            </th>
            <th
              scope="col"
              className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
            >
              Stock count
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
              <td colSpan={8} className="text-center py-4 text-gray-700">
                Loading...
              </td>
            </tr>
          )}
          {!loading && books?.length <= 0 && (
            <tr>
              <td colSpan={8} className="text-center py-4 text-gray-700">
                No data found
              </td>
            </tr>
          )}
          {books.map((book, ind) => (
            <tr
              key={book.id}
              className="bg-white transition-all duration-500 hover:bg-gray-50"
            >
              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 ">
                {ind + 1}
              </td>
              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                <ImageViewer>
                  <img
                    width={30}
                    src={
                      book.photo
                        ? getImage(book.photo.prefix, book.photo.name)
                        : "/new.png"
                    }
                    alt="book cover"
                    className=" rounded"
                  />
                </ImageViewer>
              </td>
              <td className="p-5  text-sm leading-6 font-medium text-gray-900">
                {book.name}
              </td>

              <td className="p-5   text-sm leading-6 font-medium text-gray-900">
                {book.author.fullName}
              </td>
              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                {book.productCategory.name}
              </td>
              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                {book.price?.toLocaleString()} so'm
              </td>
              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                {book.salePrice?.toLocaleString()} so'm
              </td>
              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                {book.quantity} ta
              </td>
              <td className=" p-5 ">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="p-2 rounded-full  group transition-all duration-500  flex item-center hover:text-red-600 hover:bg-gray-100"
                  >
                    <AiOutlineClose size={20} />
                  </button>
                  <button
                    onClick={() => handleEdit(book)}
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
      {/* <div className="flex justify-end mt-2">
        <Pagination
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          totalPages={totalPages}
        />
      </div> */}
    </div>
  );
};

export default BooksTable;
