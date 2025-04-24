import { AiOutlineClose } from "react-icons/ai";
import { formatUzbekPhoneNumber } from "../../../helpers/phone";
import { User } from "../../../types";
import { Request } from "../../../helpers/Request";

interface UsersTableProps {
  data: User[];
  refresh: () => Promise<void>;
}

const UsersTable = ({ data, refresh }: UsersTableProps) => {
  //
  const handleDelete = async (id: string) => {
    try {
      await Request(`/delete-user/${id}`, "DELETE", {}, true);
      refresh();
    } catch (error) {
      console.log(typeof error);
    }
  };

  return (
    <div>
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
              FullName
            </th>
            <th
              scope="col"
              className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
            >
              Phone Number
            </th>
            <th
              scope="col"
              className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {data?.length <= 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-700">
                No data found
              </td>
            </tr>
          )}
          {data.map((user, ind) => (
            <tr
              key={ind}
              className="bg-white transition-all duration-500 hover:bg-gray-50"
            >
              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 ">
                {ind + 1}
              </td>
              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                {user?.firstName + " " + user?.lastName}
              </td>
              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                {formatUzbekPhoneNumber(user?.phoneNumber)}
              </td>
              <td className=" p-5 ">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDelete(user?.id)}
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
    </div>
  );
};

export default UsersTable;
