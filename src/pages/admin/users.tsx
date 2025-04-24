import { useEffect, useState } from "react";
import { Request } from "../../helpers/Request";
import UsersTable from "./components/users-table";
import { User } from "../../types";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await Request<User[]>(
        "/super-admin/users",
        "GET",
        {},
        true
      );
      setUsers(data);
    } catch (error) {
      console.log(typeof error);
    }
  };
  return (
    <div>
      <UsersTable data={users} refresh={fetchUsers} />
    </div>
  );
};

export default Users;
