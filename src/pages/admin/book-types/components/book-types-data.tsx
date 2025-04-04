import { IoMdClose } from "react-icons/io";
import { BookType } from "../../../../types";
import { Request } from "../../../../helpers/Request";
import toast from "react-hot-toast";

interface BookTypesDataProps {
  loading: boolean;
  bookTypes: BookType[];
  refresh: () => Promise<void>;
}

const BookTypesData = ({ bookTypes, loading, refresh }: BookTypesDataProps) => {
  //

  const handleDelete = async (typeId: string) => {
    try {
      await Request(`/product-type/${typeId}`, "DELETE", {}, true);
      refresh();
    } catch (error) {
      console.log(typeof error);
      toast.error("Xatolik yuz berdi");
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (!bookTypes.length)
    return <div className="text-center">Data not found</div>;

  return (
    <div className="grid grid-cols-4 gap-3">
      {bookTypes.map((item) => (
        <div
          key={item.id}
          className="px-4 py-3 rounded-md cursor-pointer border flex justify-center items-center hover:bg-gray-50 relative"
        >
          {item.name}
          <IoMdClose
            onClick={() => handleDelete(item.id)}
            className="size-5 hover:text-red-500 absolute right-0 top-0"
          />
        </div>
      ))}
    </div>
  );
};

export default BookTypesData;
