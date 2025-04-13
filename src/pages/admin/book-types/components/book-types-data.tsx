import toast from "react-hot-toast";
import { useBookTypesStore } from "../../../../store/admin/useBookTypesStore";
import { BookType } from "../../../../types";
import { MdModeEdit } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { Request } from "../../../../helpers/Request";

interface BookTypesDataProps {
  loading: boolean;
  bookTypes: BookType[];
  refresh: () => Promise<void>;
}

const BookTypesData = ({ bookTypes, loading, refresh }: BookTypesDataProps) => {
  //
  const { setEditingId, setName, setOpen } = useBookTypesStore();

  const handleDelete = async (typeId: string) => {
    try {
      await Request(`/product-type/${typeId}`, "DELETE", {}, true);
      refresh();
      toast.success("Muvaffaqiyatli o'chirildi");
    } catch (error) {
      console.log(typeof error);
      toast.error(
        "Ushbu turni o'chira olmaysiz. Chunki bu turga kitoblar qo'shilgan"
      );
    }
  };

  const handleUpdate = (bookType: BookType) => {
    setEditingId(bookType.id);
    setName(bookType.name);
    setOpen(true);
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (!bookTypes.length)
    return <div className="text-center">Data not found</div>;

  return (
    <div className="grid grid-cols-4 gap-3">
      {bookTypes.map((item) => (
        <div
          key={item.id}
          className="px-4 py-3 rounded-md cursor-pointer border flex justify-center gap-4 items-center hover:bg-gray-50 "
        >
          <p> {item.name}</p>

          <div className="flex items-center gap-x-1">
            <IoMdClose
              onClick={() => handleDelete(item.id)}
              className="size-5 hover:text-red-500 "
            />
            <MdModeEdit
              onClick={() => handleUpdate(item)}
              className="size-5 hover:text-blue-500 "
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookTypesData;
