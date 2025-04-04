import { IoMdClose } from "react-icons/io";
import { BookCategory } from "../../../../types";
import toast from "react-hot-toast";
import { Request } from "../../../../helpers/Request";

interface CategoryDataProps {
  loading: boolean;
  categories: BookCategory[];
  refresh: () => Promise<void>;
}

const CategoryData = ({ categories, loading, refresh }: CategoryDataProps) => {
  //

  const handleDelete = async (categoryId: string) => {
    try {
      await Request(`/product-category/${categoryId}`, "DELETE", {}, true);
      refresh();
    } catch (error) {
      console.log(typeof error);
      toast.error("Xatolik yuz berdi");
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (!categories.length)
    return <div className="text-center">Data not found</div>;

  return (
    <div className="grid grid-cols-4 gap-3">
      {categories.map((item) => (
        <div
          key={item.id}
          className="px-4 py-3 rounded-md cursor-pointer border flex justify-center items-center gap-4 hover:bg-gray-50 relative"
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

export default CategoryData;
