import { Link } from "react-router-dom";
import BooksTable from "./components/books-table";

const Books = () => {
  return (
    <div>
      <div className="pb-5 px-3 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 text-2xl">Kitoblar</h3>
        <Link to={"/admin/books/create"}>
          <button
            type="button"
            className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-1 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none "
          >
            + yangi
          </button>
        </Link>
      </div>
      <div className="mt-2">
        <BooksTable />
      </div>
    </div>
  );
};

export default Books;
