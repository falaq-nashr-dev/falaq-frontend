import { useEffect, useState } from "react";
import { Request } from "../../../helpers/Request";
import { MdModeEditOutline } from "react-icons/md";
import { Category } from "../../../types";

const Categories = () => {
  const [inputVisible, setInputVisible] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const handleSaveCategory = async () => {
    try {
      setLoading(true);
      await Request("/category", "POST", {
        name,
      });
      setName("");
      fetchCategories();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await Request<Category[]>("/category", "GET");

      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = () => {};

  return (
    <div className="min-h-[300px]">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800 text-2xl">Kategoriyalar</h3>
        {inputVisible ? (
          <div className=" flex items-center gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="kategoriya nomi..."
              required
            />
            <div className="flex items-center gap-x-1">
              <button
                disabled={loading}
                onClick={handleSaveCategory}
                className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-1 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                {loading ? "Saqlanmoqda..." : "Saqlash"}
              </button>
              <button
                onClick={() => setInputVisible(false)}
                className=" bg-gray-200 hover:bg-gray-300 focus:ring-1 focus:ring-gray-300 font-medium rounded-md  px-4 py-2 focus:outline-none "
              >
                x
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setInputVisible(true)}
            className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-1 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  focus:outline-none "
          >
            + yangi
          </button>
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 px-3 py-1">
        {loading && <div>Loading...</div>}
        {categories.map((item, ind) => (
          <div
            key={ind}
            className="py-2 pl-4 pr-3 rounded-md bg-gray-100 flex items-center gap-x-3"
          >
            <p>{item.name}</p>
            <MdModeEditOutline
              onClick={() => handleEdit()}
              className="size-5 hover:text-blue-500 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
