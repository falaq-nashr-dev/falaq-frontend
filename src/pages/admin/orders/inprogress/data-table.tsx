import { useEffect, useState } from "react";
import { Request } from "../../../../helpers/Request";
import { Order } from "../../../../types";
import { formatDate } from "../../../../helpers/date";
import { formatUzbekPhoneNumber } from "../../../../helpers/phone";
import { FaRegCheckSquare, FaRegEye } from "react-icons/fa";
import toast from "react-hot-toast";
import ItemsModal from "../new/items-modal";
import { MdOutlineCancelPresentation } from "react-icons/md";

const DataTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<null | Order>(null);

  useEffect(() => {
    fetchProgressOrders();

    const intervalId = setInterval(() => {
      fetchProgressOrders();
    }, 30000); // 30,000 milliseconds = 30 seconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchProgressOrders = async () => {
    try {
      setLoading(true);
      const { data } = await Request<Order[]>(
        `/orders/status/IN_PROGRESS`,
        "GET",
        {},
        true
      );
      setOrders(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const changeOrderToCompleted = async (id: string) => {
    try {
      setLoading(true);
      await Request(`/orders/${id}/status?status=COMPLETED`, "PATCH", {}, true);
      fetchProgressOrders();
      toast.success("Muvaffaqiyatli o'zgartirildi");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const changeOrderToCancel = async (id: string) => {
    try {
      setLoading(true);
      await Request(`/orders/${id}/status?status=CANCELLED`, "PATCH", {}, true);
      fetchProgressOrders();
      toast.success("Muvaffaqiyatli o'zgartirildi");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeeDetail = (selectedOrder: Order) => {
    setOpen(true);
    setCurrentOrder(selectedOrder);
  };

  return (
    <div className={`${loading ? "pointer-events-none opacity-50" : ""}`}>
      <table className=" min-w-full rounded-xl">
        <thead>
          <tr className="bg-gray-50">
            <th
              scope="col"
              className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-tl-xl"
            >
              №
            </th>
            <th
              scope="col"
              className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
            >
              Ism Familiya
            </th>
            <th
              scope="col"
              className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
            >
              Telefon raqam
            </th>
            <th
              scope="col"
              className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
            >
              Status
            </th>
            <th
              scope="col"
              className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
            >
              Vaqt
            </th>
            <th
              scope="col"
              className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {loading && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-700">
                Loading...
              </td>
            </tr>
          )}
          {!loading && orders?.length <= 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-700">
                No data found
              </td>
            </tr>
          )}
          {orders.map((order, ind) => (
            <tr
              key={ind}
              className="bg-white transition-all duration-500 hover:bg-gray-50"
            >
              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 ">
                {order.orderId?.slice(0, 5)}
              </td>
              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                {order.customerFullName}
              </td>
              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                {formatUzbekPhoneNumber(order.customerPhoneNumber)}
              </td>

              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                <div className="p-1 rounded-md flex justify-center items-center text-white bg-blue-500 hover:bg-blue-600 text-xs">
                  PROGRESS
                </div>
              </td>
              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                {formatDate(order.createdAt)}
              </td>
              <td className=" p-5 ">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleSeeDetail(order)}
                    title="Mahsulotlarni ko'rish"
                    className="p-2 rounded-full  group transition-all duration-500  flex item-center hover:text-sky-600 hover:bg-gray-100"
                  >
                    <FaRegEye size={20} />
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => changeOrderToCompleted(order?.orderId)}
                    title="completedga o'tkazish"
                    className="p-2 rounded-full  group transition-all duration-500  flex item-center hover:text-green-600 hover:bg-gray-100 disabled:pointer-events-none disabled:cursor-not-allowed"
                  >
                    <FaRegCheckSquare size={20} />
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => changeOrderToCancel(order?.orderId)}
                    title="bekor qilish"
                    className="p-2 rounded-full  group transition-all duration-500  flex item-center hover:text-red-600 hover:bg-gray-100 disabled:pointer-events-none disabled:cursor-not-allowed"
                  >
                    <MdOutlineCancelPresentation size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <ItemsModal
          handleClose={() => setOpen(false)}
          item={currentOrder!}
          open={open}
        />
      </div>
      <div className="flex justify-end mt-2"></div>
    </div>
  );
};

export default DataTable;
