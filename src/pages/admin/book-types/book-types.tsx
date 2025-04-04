import { Request } from "../../../helpers/Request";
import { BookType } from "../../../types";
import { useCallback, useEffect, useState } from "react";
import BookTypesData from "./components/book-types-data";
import TypesFormModal from "./components/types-form-modal";

const BookTypes = () => {
  const [open, setOpen] = useState(false);
  const [bookTypes, setBookTypes] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookTypes = useCallback(async () => {
    try {
      const { data } = await Request<BookType[]>(
        "/product-type",
        "GET",
        {},
        true
      );
      setBookTypes(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookTypes();
  }, [fetchBookTypes]);

  return (
    <div>
      <div className="pb-5 px-3 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 text-2xl">Turlar</h3>
        <button
          onClick={() => setOpen(true)}
          type="button"
          className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-1 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none "
        >
          + yangi
        </button>
      </div>
      <div className="mt-2">
        <BookTypesData
          refresh={fetchBookTypes}
          bookTypes={bookTypes}
          loading={loading}
        />
      </div>
      <div>
        <TypesFormModal
          refresh={fetchBookTypes}
          handleClose={() => setOpen(false)}
          open={open}
        />
      </div>
    </div>
  );
};

export default BookTypes;
