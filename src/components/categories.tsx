import { GoChevronRight } from "react-icons/go";
import { useRef, useState, MouseEvent, useEffect } from "react";
import AllCategoryModal from "./all-category-modal";
import { Category } from "../types";
import { Request } from "../helpers/Request";
import { useStore } from "../store/useStore";

const Categories: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await Request<Category[]>("/category", "GET");

      setCategories(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);

    // Move selected category to the first position after "Hammasi"
    // setCategories((prevCategories) => [
    //   category,
    //   ...prevCategories.filter((cat) => cat !== category),
    // ]);
  };

  const startDragging = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const onDrag = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Adjust scrolling speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-lg text-gray-800">Kategoriyalar</h1>
        <div
          onClick={() => setIsOpen(true)}
          className="flex items-center group"
        >
          <p className="text-gray-500 font-normal hover:underline">Barchasi</p>
          <GoChevronRight className="size-5 text-gray-700 mt-[1px] group-hover:translate-x-[1px] transition-all duration-300" />
        </div>
      </div>
      <div
        ref={scrollRef}
        className="mt-2 py-2 flex items-center gap-x-2 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing "
        onMouseDown={startDragging}
        onMouseLeave={stopDragging}
        onMouseUp={stopDragging}
        onMouseMove={onDrag}
      >
        <button
          onClick={() => setSelectedCategory(null)}
          className={` group ${
            selectedCategory === null
              ? "bg-[#348AEC] text-white py-[12px]"
              : "bg-gray-100 text-gray-600 py-[10px]"
          }  focus:ring-1 focus:outline-none focus:ring-blue-300 font-medium rounded-[10px] text-sm px-[16px]  text-center relative overflow-hidden hover:opacity-80 flex-shrink-0 transition-all duration-300`}
        >
          <div
            className={`absolute top-[-31px] left-[-31px] w-[50px] h-[50px] rounded-3xl ${
              selectedCategory === null ? "bg-[#8cbdf5]" : "bg-gray-50"
            }  bg-opacity-50`}
          ></div>
          Hammasi
        </button>
        {loading &&
          [1, 1, 1].map((_, ind) => (
            <button
              key={ind}
              className="bg-gray-200 rounded-[10px] w-[120px] h-[40px] animate-pulse"
              disabled
            ></button>
          ))}
        {categories.map((category, index) => (
          <button
            onClick={() => handleCategorySelect(category.id)}
            key={index}
            className={` ${
              selectedCategory === category.id
                ? "bg-[#348AEC] text-white py-[12px]"
                : "bg-gray-100 text-gray-600 py-[10px]"
            }   group  focus:ring-1 focus:outline-none focus:ring-blue-300 font-medium rounded-[10px] text-sm px-[18px]  text-center relative overflow-hidden hover:opacity-80 flex-shrink-0 transition-all duration-300`}
          >
            <div
              className={`absolute top-[-31px] left-[-31px] w-[50px] h-[50px] rounded-3xl bg-gray-50 bg-opacity-50`}
            ></div>
            {category.name}
          </button>
        ))}
      </div>
      <div>
        <AllCategoryModal handleClose={() => setIsOpen(false)} open={isOpen} />
      </div>
    </div>
  );
};

export default Categories;
