// Type 
export interface UserType {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "user" | "deliveryman";
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "user" | "deliveryman";
  createdAt: string;
}

// type AddUserForm = {
//   name: string
//   email: string
//   password: string
//   role: "user" | "admin" | "deliveryman"
//   avatar?: FileList
// }

export interface Brand {
  _id: string;
  name: string;
  image?: string;
  createdAt: string;
}



