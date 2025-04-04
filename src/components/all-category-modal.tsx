import { Drawer } from "vaul";
import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { Category } from "../types";
import { Request } from "../helpers/Request";

interface AllCategoryModalProps {
  open: boolean;
  handleClose: () => void;
}

const AllCategoryModal = ({ handleClose, open }: AllCategoryModalProps) => {
  const { setSelectedCategory } = useStore();

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    handleClose();
  };

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await Request<Category[]>("/category", "GET");
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Drawer.Root onClose={handleClose} open={open} onOpenChange={handleClose}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-gray-100 flex flex-col items-center rounded-t-[10px] mt-24 h-fit fixed bottom-0 left-0 right-0 outline-none z-[200]">
            <Drawer.Title className="hidden"></Drawer.Title>
            <Drawer.Description className="hidden"></Drawer.Description>

            <div className="w-full p-4 bg-white rounded-t-[10px]">
              {/* Handle Drawer */}
              <div
                aria-hidden
                className="mx-auto w-12 h-1.5 rounded-full bg-gray-300 mb-6"
              />
              <div className=" min-h-[300px]">
                <p className="text-lg font-medium text-center">Kategoriyalar</p>
                <div className="mt-2 py-3 px-1 grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                  {categories?.map((category, index) => (
                    <button
                      onClick={() => handleCategorySelect(category.id)}
                      key={index}
                      className="text-gray-600 group bg-gray-100 focus:ring-1 focus:outline-none focus:ring-blue-300 font-medium rounded-[10px] text-sm px-[18px] py-[10px] text-center relative overflow-hidden hover:opacity-80 flex-shrink-0"
                    >
                      <div className="absolute top-[-31px] left-[-31px] w-[50px] h-[50px] rounded-3xl bg-gray-50 bg-opacity-50"></div>
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
};

export default AllCategoryModal;
