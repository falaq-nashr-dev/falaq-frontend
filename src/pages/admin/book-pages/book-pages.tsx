import { Request } from "../../../helpers/Request";
import { useEffect, useState } from "react";
import BookPagesData from "./components/book-pages-data";
import { AdminBooks } from "../../../types";

const BookPages = () => {
  // const [bookPages, setBookPages] = useState<BookPage[]>([]);
  const [books, setBooks] = useState<AdminBooks[]>([]);

  const [loading, setLoading] = useState(true);

  // Fetch books
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data } = await Request<AdminBooks[]>(
        `/products`,
        "GET",
        {},
        true
      );
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="pb-5 px-3 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 text-2xl">Kitoblar ro'yhati</h3>
      </div>
      <div className="mt-2">
        <BookPagesData books={books} loading={loading} />
      </div>
    </div>
  );
};

export default BookPages;
