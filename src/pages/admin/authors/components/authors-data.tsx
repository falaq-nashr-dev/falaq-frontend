import { Author } from "../../../../types";
import { MdModeEdit } from "react-icons/md";
import { useAuthorStore } from "../../../../store/admin/useAuthorStore";
import { Request } from "../../../../helpers/Request";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
interface AuthorsDataProps {
  authors: Author[];
  loading: boolean;
  refresh: () => Promise<void>;
}
const AuthorsData = ({ authors, loading, refresh }: AuthorsDataProps) => {
  //
  const { setEditingId, setOpen, setDefinition, setName } = useAuthorStore();

  const handleDelete = async (authorId: string) => {
    try {
      await Request(`/authors/${authorId}`, "DELETE", {}, true);
      refresh();
      toast.success("Muvaffaqiyatli o'chirildi");
    } catch (error) {
      console.log(typeof error);
      toast.error(
        "Ushbu muallifni o'chira olmaysiz. Chunki bu muallifga kitoblar qo'shilgan"
      );
    }
  };

  const handleEdit = async (author: Author) => {
    setEditingId(author.id);
    setOpen(true);
    setName(author.fullName);
    setDefinition(author.definition);
  };

  return (
    <div
      className={`overflow-x-auto ${
        loading ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <table className="w-full  rounded-xl">
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
              FullName
            </th>
            <th
              scope="col"
              className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
            >
              Definition
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
          {!loading && authors?.length <= 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-700">
                No data found
              </td>
            </tr>
          )}
          {authors.map((author, ind) => (
            <tr
              key={author.id}
              className="bg-white transition-all duration-500 hover:bg-gray-50"
            >
              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 ">
                {ind + 1}
              </td>
              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                {author.fullName}
              </td>
              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                {author.definition}
              </td>

              <td className=" p-5 ">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDelete(author?.id)}
                    className="p-2 rounded-full  group transition-all duration-500  flex item-center hover:text-red-600 hover:bg-gray-100"
                  >
                    <IoMdClose size={20} />
                  </button>
                  <button
                    onClick={() => handleEdit(author)}
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

export default AuthorsData;
