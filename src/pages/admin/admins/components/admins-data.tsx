import { AiOutlineClose } from "react-icons/ai";
import { Operator } from "../../../../types";
import { formatUzbekPhoneNumber } from "../../../../helpers/phone";

interface AdminsDataProps {
  admins: Operator[];
  loading: boolean;
  deleteAdmin: (adminId: string) => Promise<void>;
}
const AdminsData = ({ admins, loading, deleteAdmin }: AdminsDataProps) => {
  return (
    <div
      className={`overflow-x-auto ${
        loading ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <table className=" w-full  rounded-xl">
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
              FullName
            </th>
            <th
              scope="col"
              className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
            >
              Phone number
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
          {!loading && admins?.length <= 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-700">
                No data found
              </td>
            </tr>
          )}
          {admins.map((admin, ind) => (
            <tr
              key={ind}
              className="bg-white transition-all duration-500 hover:bg-gray-50"
            >
              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 ">
                {ind + 1}
              </td>
              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                {admin.firstName} {admin.lastName}
              </td>
              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                {formatUzbekPhoneNumber(admin.phoneNumber)}
              </td>

              <td className=" p-5 ">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => deleteAdmin(admin.id)}
                    className="p-2 rounded-full  group transition-all duration-500  flex item-center hover:text-red-600 hover:bg-gray-100"
                  >
                    <AiOutlineClose size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <div className="flex justify-end mt-2">
        <Pagination
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          totalPages={totalPages}
        />
      </div> */}
    </div>
  );
};

export default AdminsData;
