import { useEffect, useState } from "react";
import { Request } from "../../../helpers/Request";
import { Operator } from "../../../types";
import AdminsData from "./components/admins-data";
import AdminsModal from "./components/admins-modal";
import toast from "react-hot-toast";

const Admins = () => {
  const [open, setOpen] = useState(false);
  const [admins, setAdmins] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch authors on search change or pagination
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const { data } = await Request<Operator[]>(
        "/super-admin/admins",
        "GET",
        {},
        true
      );
      setAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAdmin = async (adminId: string) => {
    try {
      await Request(`/super-admin/delete-user/${adminId}`, "DELETE", {}, true);
    } catch (error) {
      console.log(typeof error);
      toast.error("Xatolik yuz berdi");
    }
  };

  return (
    <div>
      <div className="pb-5 px-3 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 text-2xl">Adminlar</h3>
        <button
          onClick={() => setOpen(true)}
          type="button"
          className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-1 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none "
        >
          + yangi
        </button>
      </div>
      <div className="mt-2">
        <AdminsData
          admins={admins}
          loading={loading}
          deleteAdmin={deleteAdmin}
        />
      </div>
      <div>
        <AdminsModal
          refresh={fetchAdmins}
          handleClose={() => setOpen(false)}
          open={open}
        />
      </div>
    </div>
  );
};

export default Admins;
