import { useEffect, useState } from "react";
import { Request } from "../../../helpers/Request";
import { Operator } from "../../../types";
import OperatorsData from "./components/operators-data";
import OperatorsModal from "./components/operators-modal";

const Operators = () => {
  const [open, setOpen] = useState(false);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch authors on search change or pagination
  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    try {
      setLoading(true);
      const { data } = await Request<Operator[]>(
        "/super-admin/operators",
        "GET",
        {},
        true
      );
      setOperators(data);
    } catch (error) {
      console.error("Error fetching authors:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="pb-5 px-3 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 text-2xl">Operatorlar</h3>
        <button
          onClick={() => setOpen(true)}
          type="button"
          className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-1 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none "
        >
          + yangi
        </button>
      </div>
      <div className="mt-2">
        <OperatorsData operators={operators} loading={loading} />
      </div>
      <div>
        <OperatorsModal
          refresh={fetchOperators}
          handleClose={() => setOpen(false)}
          open={open}
        />
      </div>
    </div>
  );
};

export default Operators;
