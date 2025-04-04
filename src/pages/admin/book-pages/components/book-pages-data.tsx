import { useNavigate } from "react-router-dom";
import { AdminBooks } from "../../../../types";
import { FaRegEye } from "react-icons/fa";

interface BookPagesDataProps {
  books: AdminBooks[];
  loading: boolean;
}
const BookPagesData = ({ books, loading }: BookPagesDataProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={`overflow-x-auto ${
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
                {book.name}
              </td>

              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
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
                    onClick={() => navigate(`/admin/book-pages/${book?.id}`)}
                    className="p-2 rounded-full  group transition-all duration-500  flex item-center hover:text-red-600 hover:bg-gray-100"
                  >
                    <FaRegEye size={20} />
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

export default BookPagesData;
