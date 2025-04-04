import { Request } from "../../../helpers/Request";
import { BookCategory } from "../../../types";
import CategoryData from "./components/category-data";
import CategoryFormModal from "./components/category-form-modal";
import { useCallback, useEffect, useState } from "react";

const Categories = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<BookCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await Request<BookCategory[]>(
        "/product-category",
        "GET",
        {},
        true
      );
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div>
      <div className="pb-5 px-3 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 text-2xl">Kategoriyalar</h3>
        <button
          onClick={() => setOpen(true)}
          type="button"
          className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-1 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none "
        >
          + yangi
        </button>
      </div>
      <div className="mt-2">
        <CategoryData
          refresh={fetchCategories}
          categories={categories}
          loading={loading}
        />
      </div>
      <div>
        <CategoryFormModal
          refresh={fetchCategories}
          handleClose={() => setOpen(false)}
          open={open}
        />
      </div>
    </div>
  );
};

export default Categories;
