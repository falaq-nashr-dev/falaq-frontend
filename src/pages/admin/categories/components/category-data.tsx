import { useCategoryStore } from "../../../../store/admin/useCategoryStore";
import { BookCategory } from "../../../../types";
import { MdModeEdit } from "react-icons/md";

interface CategoryDataProps {
  loading: boolean;
  categories: BookCategory[];
  refresh: () => Promise<void>;
}

const CategoryData = ({ categories, loading }: CategoryDataProps) => {
  //
  const { setEditingId, setName, setOpen } = useCategoryStore();

  // const handleDelete = async (categoryId: string) => {
  //   try {
  //     await Request(`/product-category/${categoryId}`, "DELETE", {}, true);
  //     refresh();
  //   } catch (error) {
  //     console.log(typeof error);
  //     toast.error("Xatolik yuz berdi");
  //   }
  // };

  const handleUpdate = (bookType: BookCategory) => {
    setEditingId(bookType.id);
    setName(bookType.name);
    setOpen(true);
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
          <p>{item.name}</p>

          <div className="flex items-center gap-x-1">
            {/* <IoMdClose
                        onClick={() => handleDelete(item.id)}
                        className="size-5 hover:text-red-500 "
                      /> */}
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

export default CategoryData;
