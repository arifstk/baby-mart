// Users.tsx 

import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { useEffect, useState } from "react"

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  const fetchUsers = async()=> {
    setLoading(true);
    try {
      const response = await axiosPrivate.get("/users");
      // console.log('response', response);
      setUsers(response?.data);
      
    } catch (error) {
      console.log("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=> {
    fetchUsers();
  }, []);
  // console.log("users", users);

  return (
    <div>
      User Page
    </div>
  )
}

export default Users

