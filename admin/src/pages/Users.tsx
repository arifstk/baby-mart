// Users.tsx 

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import useAuthStore from "@/store/useAuthStore";
import { Edit, Eye, Loader2, Plus, RefreshCw, Trash, Upload, Users2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { User, UserType } from "../../type";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { userSchema } from "@/lib/validation";
import type z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';


type FormData = z.infer<typeof userSchema>

const Users = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalPage, setTotalPage] = useState(1);

  const axiosPrivate = useAxiosPrivate();
  const { checkIsAdmin } = useAuthStore();
  const isAdmin = checkIsAdmin();

  const fetchUsers = async () => {
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

  useEffect(() => {
    fetchUsers();
  }, []);
  // console.log("users", users);

  // Refresh Users
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await axiosPrivate.get("/users", {
        params: {
          page,
          perPage,
          role: roleFilter !== "alt" ? roleFilter : undefined,
        }
      });
      // console.log("response", response);
      // Handle paginated and non-paginated response
      if (response.data) {
        setUsers(response.data);
        // setTotal(response.data.total || response.data.users.length);
        // setTotalPages(response.data.totalPages || 1);
      } else {
        setUsers(response.data);
        // setTotal(response.data.length);
        // setTotalPages();
      }
      
    } catch (error) {
      console.log("Failed to refresh users", error);
      toast("Failed to refresh users");
    } finally {
      setRefreshing(false);
    }
  };


  // Role color 
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "deliveryman":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Add Users 
  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      avatar: "",
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };


  // Create Users Submit function
  const onSubmit = async (data: FormData) => {
    setFormLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", data.role);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await axiosPrivate.post("/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("✅ User added successfully");

      reset();
      setAvatarFile(null);
      setIsAddModalOpen(false);
      fetchUsers(); // refresh list
    } catch (error) {
      console.error("Failed to create user", error);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-0.5">View & manage all system users</p>
        </div>
        <div className="flex items-center gap-4 ">
          <div className="text-blue-600 flex items-center gap-1">
            <Users2 className="w-8 h-8" />
            <p className="text-2xl font-bold">{users?.length}</p>
          </div>
          <Button
            variant={"outline"}
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-blue-600 text-blue-600 hover:bg-blue-50">
            <RefreshCw
              className={`mr-0.5 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          {
            isAdmin &&
            <Button
              onClick={() => setIsAddModalOpen(true)}
              variant={"outline"}
              className="bg-blue-600 text-white hover:bg-blue-50">
              <Plus /> Add User
            </Button>
          }
        </div>
      </div>

      {/* Filters */}
      {/* Users Table  */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Avatar</TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Created At</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users?.length > 0 ? (users?.map((user) => (
              <TableRow key={user?._id}>
                <TableCell>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? <img src={user?.avatar} alt="img" className="w-ful h-full" /> : <span className="text-lg font-semibold text-black">{user?.name.charAt(0).toUpperCase()}</span>}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{user?.name}</TableCell>
                <TableCell className="text-gray-600">{user.email}</TableCell>
                <TableCell>
                  <Badge className={cn("capitalize", getRoleColor(user.role))}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant={"ghost"} size="icon" title="View user details" className="border-border">
                      <Eye />
                    </Button>
                    <Button variant={"ghost"} size="icon" title="Edit user" className="border-border">
                      <Edit />
                    </Button>
                    <Button variant={"ghost"} size="icon" title="Delete user" className="border-border">
                      <Trash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))) : <div className="text-lg font-semibold p-5">No users</div>}
          </TableBody>
        </Table>
      </div>
      {/* Add user Modal  */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-137 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Users</DialogTitle>
            <DialogDescription>Create a new user account</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldSet>
              {/* Name */}
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input {...register("name")} placeholder="Full name" />
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input {...register("email")} placeholder="email@example.com" />
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </Field>

              {/* Password */}
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input type="password" {...register("password")} />
                {errors.password && <FieldError>{errors.password.message}</FieldError>}
              </Field>

              {/* Role */}
              <Field>
                <FieldLabel>Role</FieldLabel>
                <Select
                  defaultValue="user"
                  onValueChange={(value) =>
                    setValue("role", value as FormData["role"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="deliveryman">Delivery Man</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {/* Avatar */}
              <Field>
                <FieldLabel>Avatar</FieldLabel>
                <label className="border border-dashed rounded-lg p-6 flex flex-col items-center cursor-pointer">
                  {avatarFile ? (
                    <img
                      src={URL.createObjectURL(avatarFile)}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400" />
                      <p className="text-sm text-gray-500">Click to upload</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleAvatarChange}
                  />
                </label>
              </Field>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={formLoading}>
                  {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create User
                </Button>
              </div>
            </FieldSet>
          </form>

        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Users

