import { useEffect, useState } from "react";
import AuthorsData from "./components/authors-data";
import { Author } from "../../../types";
import { Request } from "../../../helpers/Request";
import AuthorsFormModal from "./components/authors-form-modal";

const Authors = () => {
  const [open, setOpen] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch authors on search change or pagination
  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const { data } = await Request<Author[]>("/authors", "GET", {}, true);
      setAuthors(data);
    } catch (error) {
      console.error("Error fetching authors:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="pb-5 px-3 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 text-2xl">Mualliflar</h3>
        <button
          onClick={() => setOpen(true)}
          type="button"
          className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-1 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none "
        >
          + yangi
        </button>
      </div>
      <div className="mt-2">
        <AuthorsData
          refresh={fetchAuthors}
          authors={authors}
          loading={loading}
        />
      </div>
      <div>
        <AuthorsFormModal
          refresh={fetchAuthors}
          handleClose={() => setOpen(false)}
          open={open}
        />
      </div>
    </div>
  );
};

export default Authors;
