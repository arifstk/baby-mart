// // // categories page
// // import { Button } from "@/components/ui/button";
// // import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// // import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
// // import { Input } from "@/components/ui/input";
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// // import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
// // import { categorySchema } from "@/lib/validation";
// // import useAuthStore from "@/store/useAuthStore";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { Loader2, Package, Plus, RefreshCw, Search, Upload } from "lucide-react";
// // import { useEffect, useState } from "react";
// // import { useForm } from "react-hook-form";
// // import { toast } from "sonner";
// // import type { Category } from "type";
// // import type z from "zod";


// // type CategoryFormData = z.infer<typeof categorySchema>;


// // const Categories = () => {
// //   const [categories, setCategories] = useState<Category[]>([]);
// //   const [total, setTotal] = useState(0);
// //   const [page, setPage] = useState(1);
// //   const [perPage, setPerPage] = useState(10);
// //   const [totalPages, setTotalPages] = useState(0);
// //   const [sortOrder, setSortOrder] = useState('asc');
// //   const [loading, setLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [categoryTypeFilter, setCategoryTypeFilter] = useState<string>("all");
// //   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
// //   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
// //   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
// //   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
// //   const [formLoading, setFormLoading] = useState(false);

// //   const axiosPrivate = useAxiosPrivate();
// //   const { checkIsAdmin } = useAuthStore();
// //   const isAdmin = checkIsAdmin();

// //   const formAdd = useForm<CategoryFormData>({
// //     resolver: zodResolver(categorySchema),
// //     defaultValues: {
// //       name: "",
// //       image: undefined,
// //       categoryType: "Featured",
// //     },
// //   });

// //   const formEdit = useForm<CategoryFormData>({
// //     resolver: zodResolver(categorySchema),
// //     defaultValues: {
// //       name: "",
// //       image: undefined,
// //       categoryType: "Featured",
// //     },
// //   });

// //   const fetchCategories = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await axiosPrivate.get('/categories', {
// //         params: { page, perPage, sortOrder },
// //       });
// //       // console.log("Response", response);
// //       setCategories(response?.data?.categories || []);
// //       setTotal(response?.data?.total || 0);
// //       setTotalPages(response?.data?.totalPages || 1);
// //     } catch (error) {
// //       console.error("Error fetching categories:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchCategories();
// //   }, [page, sortOrder]);

// //   // handle Refresh
// //   const handleRefresh = async () => {
// //     setRefreshing(true);
// //     try {
// //       const response = await axiosPrivate.get("/categories", {
// //         params: {
// //           page, perPage, sortOrder,
// //           search: searchTerm.trim() || undefined,
// //           categoryType:
// //             categoryTypeFilter === "all" ? undefined : categoryTypeFilter,
// //         },
// //       });
// //       setCategories(response?.data?.categories || []);
// //       setTotal(response?.data?.total || 0);
// //       setTotalPages(response?.data?.totalPages || 1);
// //       toast.success("Categories refreshed");
// //     } catch (error) {
// //       console.log("Failed to refresh categories", error);
// //       toast.error("Failed to refresh categories");
// //     } finally {
// //       setRefreshing(false);
// //     }
// //   };

// //   const handleSearchChange = (value: string) => {
// //     setSearchTerm(value);
// //     setPage(1); // Reset page to 1 when searching
// //   };

// //   const handleSortOrderChange = (value: string) => {
// //     setSortOrder(value as "asc" | "desc");
// //     setPage(1);
// //   }

// //   return (
// //     <div className="p-4">
// //       {/* Header */}
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
// //           <p className="text-gray-600 mt-1">Manage product categories and their organization</p>
// //         </div>
// //         <div className="flex items-center gap-3">
// //           <Button
// //             variant="outline"
// //             size="sm"
// //             onClick={handleRefresh}
// //             disabled={refreshing}
// //             className="flex items-center gap-2"
// //           >
// //             <RefreshCw />{refreshing ? "Refreshing..." : "Refresh"}
// //           </Button>
// //           <div className="flex items-center gap-2">
// //             <Package className="h-8 w-8 text-blue-600" />
// //             <span className="text-2xl font-semibold text-blue-600">{total}</span>
// //           </div>
// //         </div>
// //       </div>
// //       {/* Filter */}
// //       <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
// //         <div className="flex items-center gap-4 text-wrap">
// //           <div className="flex items-center gap-2">
// //             <Search />
// //             <Input placeholder="Search Categories..."
// //               value={searchTerm}
// //               onChange={(e) => handleSearchChange(e.target.value)}
// //               className="w-64" />
// //           </div>
// //           <Select
// //             value={categoryTypeFilter}
// //             onValueChange={setCategoryTypeFilter}
// //           >
// //             <SelectTrigger>
// //               <SelectValue placeholder="Filter by Type" />
// //             </SelectTrigger>
// //             <SelectContent>
// //               <SelectItem value="all" onClick={() => setCategoryTypeFilter("all")}>
// //                 All Types
// //               </SelectItem>
// //               <SelectItem value="Featured" onClick={() => setCategoryTypeFilter("Featured")}>
// //                 Featured
// //               </SelectItem>
// //               <SelectItem value="Hot-Categories" onClick={() => setCategoryTypeFilter("Hot-Categories")}>
// //                 Hot-Categories
// //               </SelectItem>
// //               <SelectItem value="Top-Categories" onClick={() => setCategoryTypeFilter("Top-Categories")}>
// //                 Top-Categories
// //               </SelectItem>
// //             </SelectContent>
// //           </Select>

// //           <Select
// //             value={sortOrder}
// //             onValueChange={handleSortOrderChange}
// //           >
// //             <SelectTrigger>
// //               <SelectValue placeholder="Newest / Oldest" />
// //             </SelectTrigger>
// //             <SelectContent>
// //               {/* <SelectItem value="all" onClick={() => setCategoryTypeFilter("all")}>
// //                 All Types
// //               </SelectItem> */}
// //               <SelectItem value="asc" onClick={() => handleSortOrderChange("Newest First")}>
// //                 Newest First
// //               </SelectItem>
// //               <SelectItem value="desc" onClick={() => handleSortOrderChange("Oldest Last")}>
// //                 Oldest Last
// //               </SelectItem>
// //             </SelectContent>
// //           </Select>

// //           <Button onClick={() => setIsAddModalOpen(true)}>
// //             <Plus className="h-4 w-4 mr-1" /> Add Category
// //           </Button>
// //         </div>
// //       </div>
// //       {/* Add Category Modal */}
// //       {/* <Dialog>
// //         <DialogContent>
// //           <DialogHeader>
// //             <DialogTitle>Add Category</DialogTitle>
// //             <DialogDescription>Create a new Product category</DialogDescription>
// //           </DialogHeader>

// //         </DialogContent>
// //       </Dialog> */}

// //       <Dialog
// //         open={isAddModalOpen}
// //         onOpenChange={(open) => {
// //           if (!open) { reset(); setImageFile(null); }
// //           setIsAddModalOpen(open);
// //         }}
// //       >
// //         <DialogContent className="sm:max-w-137 max-h-[90vh] overflow-y-auto">
// //           <DialogHeader>
// //             <DialogTitle className="text-2xl font-semibold">Add Category</DialogTitle>
// //             <DialogDescription>Create a new product category</DialogDescription>
// //           </DialogHeader>

// //           <form onSubmit={handleSubmit(onSubmit)}>
// //             <FieldSet>
// //               {/* Name */}
// //               <Field>
// //                 <FieldLabel>Name</FieldLabel>
// //                 <Input {...register("name")} placeholder="Category name" />
// //                 {errors.name && <FieldError>{errors.name.message}</FieldError>}
// //               </Field>

// //               {/* Category Type */}
// //               <Field>
// //                 <FieldLabel>Category Type</FieldLabel>
// //                 <Select
// //                   defaultValue="Featured"
// //                   onValueChange={(value) =>
// //                     setValue("categoryType", value as CategoryFormData["categoryType"])
// //                   }
// //                 >
// //                   <SelectTrigger>
// //                     <SelectValue placeholder="Select type" />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="Featured">Featured</SelectItem>
// //                     <SelectItem value="Hot-Categories">Hot Categories</SelectItem>
// //                     <SelectItem value="Top-Categories">Top Categories</SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //                 {errors.categoryType && <FieldError>{errors.categoryType.message}</FieldError>}
// //               </Field>

// //               {/* Category Image */}
// //               <Field>
// //                 <FieldLabel>Category Image (Optional)</FieldLabel>
// //                 <label className="border border-dashed rounded-lg p-6 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition-colors">
// //                   {imageFile ? (
// //                     <img
// //                       src={URL.createObjectURL(imageFile)}
// //                       alt="Preview"
// //                       className="h-24 w-24 rounded-lg object-cover"
// //                     />
// //                   ) : (
// //                     <>
// //                       <Upload className="w-8 h-8 text-gray-400" />
// //                       <p className="text-sm text-gray-500 mt-1">Drag & drop or click to upload</p>
// //                       <p className="text-xs text-gray-400">Image (max 4MB)</p>
// //                     </>
// //                   )}
// //                   <input
// //                     type="file"
// //                     accept="image/*"
// //                     hidden
// //                     onChange={handleImageChange}
// //                   />
// //                 </label>
// //               </Field>

// //               {/* Footer */}
// //               <div className="flex justify-end gap-3 pt-4">
// //                 <Button
// //                   type="button"
// //                   variant="outline"
// //                   onClick={() => { reset(); setImageFile(null); setIsAddModalOpen(false); }}
// //                 >
// //                   Cancel
// //                 </Button>
// //                 <Button type="submit" disabled={formLoading}>
// //                   {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
// //                   Create Category
// //                 </Button>
// //               </div>
// //             </FieldSet>
// //           </form>
// //         </DialogContent>
// //       </Dialog>
// //     </div>
// //   )
// // }

// // export default Categories



// // categories page
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
// import { categorySchema } from "@/lib/validation";
// import useAuthStore from "@/store/useAuthStore";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Edit, Eye, Loader2, Package, Plus, RefreshCw, Search, Trash, Upload } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import type { Category } from "type";
// import type z from "zod";

// type CategoryFormData = z.infer<typeof categorySchema>;

// const Categories = () => {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(0);
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryTypeFilter, setCategoryTypeFilter] = useState<string>("all");
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [formLoading, setFormLoading] = useState(false);
//   const [imageFile, setImageFile] = useState<File | null>(null);

//   const axiosPrivate = useAxiosPrivate();
//   const { checkIsAdmin } = useAuthStore();
//   const isAdmin = checkIsAdmin();

//   const {
//     register,
//     setValue,
//     reset,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<CategoryFormData>({
//     resolver: zodResolver(categorySchema),
//     defaultValues: {
//       name: "",
//       image: undefined,
//       categoryType: "Featured",
//     },
//   });

//   const fetchCategories = async () => {
//     setLoading(true);
//     try {
//       const response = await axiosPrivate.get("/categories", {
//         params: { page, perPage, sortOrder },
//       });
//       setCategories(response?.data?.categories || []);
//       setTotal(response?.data?.total || 0);
//       setTotalPages(response?.data?.totalPages || 1);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, [page, sortOrder]);

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     try {
//       const response = await axiosPrivate.get("/categories", {
//         params: {
//           page,
//           perPage,
//           sortOrder,
//           search: searchTerm.trim() || undefined,
//           categoryType: categoryTypeFilter === "all" ? undefined : categoryTypeFilter,
//         },
//       });
//       setCategories(response?.data?.categories || []);
//       setTotal(response?.data?.total || 0);
//       setTotalPages(response?.data?.totalPages || 1);
//       toast.success("Categories refreshed");
//     } catch (error) {
//       console.log("Failed to refresh categories", error);
//       toast.error("Failed to refresh categories");
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   const handleSearchChange = (value: string) => {
//     setSearchTerm(value);
//     setPage(1);
//   };

//   const handleSortOrderChange = (value: string) => {
//     setSortOrder(value as "asc" | "desc");
//     setPage(1);
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setImageFile(e.target.files[0]);
//     }
//   };

//   const onSubmit = async (data: CategoryFormData) => {
//     setFormLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("name", data.name);
//       formData.append("categoryType", data.categoryType);
//       if (imageFile) formData.append("image", imageFile);

//       await axiosPrivate.post("/categories", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       toast.success("✅ Category added successfully");
//       reset();
//       setImageFile(null);
//       setIsAddModalOpen(false);
//       fetchCategories();
//     } catch (error) {
//       console.error("Failed to create category", error);
//       toast.error("Failed to create category");
//     } finally {
//       setFormLoading(false);
//     }
//   };



//   return (
//     <div className="p-4">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
//           <p className="text-gray-600 mt-1">Manage product categories and their organization</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={handleRefresh}
//             disabled={refreshing}
//             className="flex items-center gap-2"
//           >
//             <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
//             {refreshing ? "Refreshing..." : "Refresh"}
//           </Button>
//           <div className="flex items-center gap-2">
//             <Package className="h-8 w-8 text-blue-600" />
//             <span className="text-2xl font-semibold text-blue-600">{total}</span>
//           </div>
//         </div>
//       </div>

//       {/* Filter Bar */}
//       <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4 mt-4">
//         <div className="flex items-center gap-4 flex-wrap">
//           <div className="flex items-center gap-2">
//             <Search />
//             <Input
//               placeholder="Search categories..."
//               value={searchTerm}
//               onChange={(e) => handleSearchChange(e.target.value)}
//               className="w-64"
//             />
//           </div>

//           <Select value={categoryTypeFilter} onValueChange={setCategoryTypeFilter}>
//             <SelectTrigger className="w-44">
//               <SelectValue placeholder="Filter by Type" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Types</SelectItem>
//               <SelectItem value="Featured">Featured</SelectItem>
//               <SelectItem value="Hot-Categories">Hot Categories</SelectItem>
//               <SelectItem value="Top-Categories">Top Categories</SelectItem>
//             </SelectContent>
//           </Select>

//           <Select value={sortOrder} onValueChange={handleSortOrderChange}>
//             <SelectTrigger className="w-44">
//               <SelectValue placeholder="Sort Order" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="asc">Newest First</SelectItem>
//               <SelectItem value="desc">Oldest Last</SelectItem>
//             </SelectContent>
//           </Select>

//           <Button onClick={() => setIsAddModalOpen(true)}>
//             <Plus className="h-4 w-4 mr-1" /> Add Category
//           </Button>
//         </div>
//       </div>

//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="font-semibold">Image</TableHead>
//               <TableHead className="font-semibold">Name</TableHead>
//               <TableHead className="font-semibold">Type</TableHead>
//               <TableHead className="font-semibold">Created At</TableHead>
//               <TableHead className="font-semibold">Actions</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-center py-8">
//                   <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
//                 </TableCell>
//               </TableRow>
//             ) : filteredCategories.length > 0 ? (
//               filteredCategories.map((category) => (
//                 <TableRow key={category._id}>
//                   {/* [CHANGELOG] Image cell — shows image or Package icon placeholder, same pattern as avatar in Users.tsx */}
//                   <TableCell>
//                     <div className="h-12 w-12 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center">
//                       {category.image ? (
//                         <img
//                           src={category.image}
//                           alt={category.name}
//                           className="h-full w-full object-cover"
//                         />
//                       ) : (
//                         <Package className="h-5 w-5 text-gray-400" />
//                       )}
//                     </div>
//                   </TableCell>

//                   <TableCell className="font-medium">{category.name}</TableCell>

//                   {/* [CHANGELOG] Type badge — uses getCategoryTypeColor same as getRoleColor in Users.tsx */}
//                   <TableCell>
//                     <Badge className={cn("capitalize", getCategoryTypeColor(category.categoryType))}>
//                       {category.categoryType.replace(/-/g, " ")}
//                     </Badge>
//                   </TableCell>

//                   <TableCell>
//                     {new Date(category.createdAt).toLocaleDateString()}
//                   </TableCell>

//                   {/* [CHANGELOG] Action buttons — View, Edit, Delete with ghost icon style, same as Users.tsx */}
//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         title="View category"
//                         className="border-border"
//                         onClick={() => handleView(category)}
//                       >
//                         <Eye />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         title="Edit category"
//                         className="border-border"
//                         onClick={() => handleEdit(category)}
//                       >
//                         <Edit />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         title="Delete category"
//                         className="border-border"
//                         onClick={() => handleDelete(category)}
//                       >
//                         <Trash />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-lg font-semibold p-5">
//                   No categories found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>

//       {/* Add Category Modal */}
//       <Dialog
//         open={isAddModalOpen}
//         onOpenChange={(open) => {
//           if (!open) { reset(); setImageFile(null); }
//           setIsAddModalOpen(open);
//         }}
//       >
//         <DialogContent className="sm:max-w-137 max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="text-2xl font-semibold">Add Category</DialogTitle>
//             <DialogDescription>Create a new product category</DialogDescription>
//           </DialogHeader>

//           <form onSubmit={handleSubmit(onSubmit)}>
//             <FieldSet>
//               {/* Name */}
//               <Field>
//                 <FieldLabel>Name</FieldLabel>
//                 <Input {...register("name")} placeholder="Category name" />
//                 {errors.name && <FieldError>{errors.name.message}</FieldError>}
//               </Field>

//               {/* Category Type */}
//               <Field>
//                 <FieldLabel>Category Type</FieldLabel>
//                 <Select
//                   defaultValue="Featured"
//                   onValueChange={(value) =>
//                     setValue("categoryType", value as CategoryFormData["categoryType"])
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Featured">Featured</SelectItem>
//                     <SelectItem value="Hot-Categories">Hot Categories</SelectItem>
//                     <SelectItem value="Top-Categories">Top Categories</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 {errors.categoryType && <FieldError>{errors.categoryType.message}</FieldError>}
//               </Field>

//               {/* Category Image */}
//               <Field>
//                 <FieldLabel>Category Image (Optional)</FieldLabel>
//                 <label className="border border-dashed rounded-lg p-6 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition-colors">
//                   {imageFile ? (
//                     <img
//                       src={URL.createObjectURL(imageFile)}
//                       alt="Preview"
//                       className="h-24 w-24 rounded-lg object-cover"
//                     />
//                   ) : (
//                     <>
//                       <Upload className="w-8 h-8 text-gray-400" />
//                       <p className="text-sm text-gray-500 mt-1">Drag & drop or click to upload</p>
//                       <p className="text-xs text-gray-400">Image (max 4MB)</p>
//                     </>
//                   )}
//                   <input
//                     type="file"
//                     accept="image/*"
//                     hidden
//                     onChange={handleImageChange}
//                   />
//                 </label>
//               </Field>

//               {/* Footer */}
//               <div className="flex justify-end gap-3 pt-4">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => { reset(); setImageFile(null); setIsAddModalOpen(false); }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={formLoading}>
//                   {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                   Create Category
//                 </Button>
//               </div>
//             </FieldSet>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Categories;



// categories page
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"; // [CHANGELOG] Added AlertDialog for delete confirmation — same as Users.tsx
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // [CHANGELOG] Added Label for view modal details — same as Users.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // [CHANGELOG] Added Table to render categories list
import { Badge } from "@/components/ui/badge"; // [CHANGELOG] Added Badge for category type pill
import { cn } from "@/lib/utils"; // [CHANGELOG] Added cn for conditional classNames
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { categorySchema, categoryUpdateSchema } from "@/lib/validation"; // [CHANGELOG] Added categoryUpdateSchema for edit form
import useAuthStore from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Eye, Loader2, Package, Plus, RefreshCw, Search, Trash, Upload } from "lucide-react"; // [CHANGELOG] Added Edit, Eye, Trash icons for action buttons
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Category } from "type";
import type z from "zod";

type CategoryFormData = z.infer<typeof categorySchema>;
type CategoryEditFormData = z.infer<typeof categoryUpdateSchema>; // [CHANGELOG] Added edit form type

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryTypeFilter, setCategoryTypeFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);       // [CHANGELOG] Added edit modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);   // [CHANGELOG] Added delete modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);       // [CHANGELOG] Added view modal state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null); // [CHANGELOG] Added selectedCategory for edit/delete/view
  const [formLoading, setFormLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const axiosPrivate = useAxiosPrivate();
  const { checkIsAdmin } = useAuthStore();
  const isAdmin = checkIsAdmin();

  // ── Add form ────
  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      image: undefined,
      categoryType: "Featured",
    },
  });

  // Added separate edit form — same pattern as formEdit in Users.tsx
  const formEdit = useForm<CategoryEditFormData>({
    resolver: zodResolver(categoryUpdateSchema),
    defaultValues: {
      name: "",
      image: undefined,
      categoryType: "Featured",
    },
  });

  // ── Fetch ───────
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get("/categories", {
        params: { page, perPage, sortOrder },
      });
      setCategories(response?.data?.categories || []);
      setTotal(response?.data?.total || 0);
      setTotalPages(response?.data?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, sortOrder]);

  // ── Refresh ─────
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await axiosPrivate.get("/categories", {
        params: {
          page,
          perPage,
          sortOrder,
          search: searchTerm.trim() || undefined,
          categoryType: categoryTypeFilter === "all" ? undefined : categoryTypeFilter,
        },
      });
      setCategories(response?.data?.categories || []);
      setTotal(response?.data?.total || 0);
      setTotalPages(response?.data?.totalPages || 1);
      toast.success("Categories refreshed");
    } catch (error) {
      console.log("Failed to refresh categories", error);
      toast.error("Failed to refresh categories");
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleSortOrderChange = (value: string) => {
    setSortOrder(value as "asc" | "desc");
    setPage(1);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  //Added getCategoryTypeColor — returns badge color based on type, same as getRoleColor in Users.tsx
  const getCategoryTypeColor = (type: string) => {
    switch (type) {
      case "Hot-Categories":
        return "bg-red-100 text-red-800";
      case "Top-Categories":
        return "bg-blue-100 text-blue-800";
      case "Featured":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // ── Add submit ────────────────────────────────────────────────────────────
  const onSubmit = async (data: CategoryFormData) => {
    setFormLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("categoryType", data.categoryType);
      if (imageFile) formData.append("image", imageFile);

      await axiosPrivate.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ Category added successfully");
      reset();
      setImageFile(null);
      setIsAddModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Failed to create category", error);
      toast.error("Failed to create category");
    } finally {
      setFormLoading(false);
    }
  };

  // [CHANGELOG] Added handleEdit — populates edit form with selected category data, same as handleEdit in Users.tsx
  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    formEdit.reset({
      name: category.name,
      categoryType: category.categoryType,
      image: undefined,
    });
    setImageFile(null);
    setIsEditModalOpen(true);
  };

  // [CHANGELOG] Added handleUpdateCategory — PUT /categories/:id with FormData, same as handleUpdateUser in Users.tsx
  const handleUpdateCategory = async (data: CategoryEditFormData) => {
    if (!selectedCategory) return;
    setFormLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("categoryType", data.categoryType);
      if (imageFile) formData.append("image", imageFile);

      await axiosPrivate.put(`/categories/${selectedCategory._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Category updated successfully");
      setIsEditModalOpen(false);
      setImageFile(null);
      fetchCategories();
    } catch (error) {
      console.error("Failed to update category", error);
      toast.error("Failed to update category");
    } finally {
      setFormLoading(false);
    }
  };

  // [CHANGELOG] Added handleDelete — opens AlertDialog confirmation, same as handleDelete in Users.tsx
  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  // [CHANGELOG] Added handleDeleteCategory — DELETE /categories/:id, same as handleDeleteUser in Users.tsx
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    setLoading(true);
    try {
      await axiosPrivate.delete(`/categories/${selectedCategory._id}`);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category", error);
      toast.error("Failed to delete category");
    }
  };

  // [CHANGELOG] Added handleView — sets selectedCategory and opens view modal, same as handleView in Users.tsx
  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setIsViewModalOpen(true);
  };

  // [CHANGELOG] Added filteredCategories — client-side filter by search term and type, same as filteredUser in Users.tsx
  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = categoryTypeFilter === "all" || category.categoryType === categoryTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600 mt-0.5">Manage product categories and their organization</p>
        </div>
        <div className="flex items-center gap-4">
          {/* [CHANGELOG] Total count display — same pattern as Users.tsx total with icon */}
          <div className="text-blue-600 flex items-center gap-1">
            <Package className="w-8 h-8" />
            <p className="text-2xl font-bold">{total}</p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <RefreshCw className={`mr-0.5 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          {isAdmin && (
            <Button
              onClick={() => setIsAddModalOpen(true)}
              variant="outline"
              className="bg-blue-600 text-white hover:bg-blue-50"
            >
              <Plus /> Add Category
            </Button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-64"
            />
          </div>

          <Select value={categoryTypeFilter} onValueChange={setCategoryTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Featured">Featured</SelectItem>
              <SelectItem value="Hot-Categories">Hot Categories</SelectItem>
              <SelectItem value="Top-Categories">Top Categories</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={handleSortOrderChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Newest First</SelectItem>
              <SelectItem value="desc">Oldest Last</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* [CHANGELOG] Added categories table — matches Users.tsx table structure exactly */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Image</TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Created At</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                </TableCell>
              </TableRow>
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <TableRow key={category._id}>
                  {/* [CHANGELOG] Image cell — shows image or Package icon placeholder, same pattern as avatar in Users.tsx */}
                  <TableCell>
                    <div className="h-12 w-12 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="font-medium">{category.name}</TableCell>

                  {/* [CHANGELOG] Type badge — uses getCategoryTypeColor same as getRoleColor in Users.tsx */}
                  <TableCell>
                    <Badge className={cn("capitalize", getCategoryTypeColor(category.categoryType))}>
                      {category.categoryType.replace(/-/g, " ")}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {new Date(category.createdAt).toLocaleDateString()}
                  </TableCell>

                  {/* [CHANGELOG] Action buttons — View, Edit, Delete with ghost icon style, same as Users.tsx */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="View category"
                        className="border-border"
                        onClick={() => handleView(category)}
                      >
                        <Eye />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit category"
                        className="border-border"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete category"
                        className="border-border"
                        onClick={() => handleDelete(category)}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-lg font-semibold p-5">
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Add Category Modal ──────────────────────────────────────────────── */}
      <Dialog open={isAddModalOpen} onOpenChange={(open) => {
        if (!open) { reset(); setImageFile(null); }
        setIsAddModalOpen(open);
      }}>
        <DialogContent className="sm:max-w-137 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Add Category</DialogTitle>
            <DialogDescription>Create a new product category</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldSet>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input {...register("name")} placeholder="Category name" />
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel>Category Type</FieldLabel>
                <Select
                  defaultValue="Featured"
                  onValueChange={(value) =>
                    setValue("categoryType", value as CategoryFormData["categoryType"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Featured">Featured</SelectItem>
                    <SelectItem value="Hot-Categories">Hot Categories</SelectItem>
                    <SelectItem value="Top-Categories">Top Categories</SelectItem>
                  </SelectContent>
                </Select>
                {errors.categoryType && <FieldError>{errors.categoryType.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel>Category Image (Optional)</FieldLabel>
                <label className="border border-dashed rounded-lg p-6 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition-colors">
                  {imageFile ? (
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Preview"
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400" />
                      <p className="text-sm text-gray-500 mt-1">Drag & drop or click to upload</p>
                      <p className="text-xs text-gray-400">Image (max 4MB)</p>
                    </>
                  )}
                  <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                </label>
              </Field>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { reset(); setImageFile(null); setIsAddModalOpen(false); }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Category
                </Button>
              </div>
            </FieldSet>
          </form>
        </DialogContent>
      </Dialog>

      {/* [CHANGELOG] Added Edit Category Modal — mirrors Add modal but pre-filled, same as edit user modal in Users.tsx */}
      <Dialog open={isEditModalOpen} onOpenChange={(open) => {
        if (!open) { formEdit.reset(); setImageFile(null); }
        setIsEditModalOpen(open);
      }}>
        <DialogContent className="sm:max-w-137 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Edit Category</DialogTitle>
            <DialogDescription>Update existing category details</DialogDescription>
          </DialogHeader>

          <form onSubmit={formEdit.handleSubmit(handleUpdateCategory)}>
            <FieldSet>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input {...formEdit.register("name")} placeholder="Category name" />
                {formEdit.formState.errors.name && (
                  <FieldError>{formEdit.formState.errors.name.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>Category Type</FieldLabel>
                <Select
                  defaultValue={formEdit.getValues("categoryType")}
                  onValueChange={(value) =>
                    formEdit.setValue("categoryType", value as CategoryEditFormData["categoryType"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Featured">Featured</SelectItem>
                    <SelectItem value="Hot-Categories">Hot Categories</SelectItem>
                    <SelectItem value="Top-Categories">Top Categories</SelectItem>
                  </SelectContent>
                </Select>
                {formEdit.formState.errors.categoryType && (
                  <FieldError>{formEdit.formState.errors.categoryType.message}</FieldError>
                )}
              </Field>

              {/* [CHANGELOG] Edit image uses file input — same lightweight pattern as avatar in edit user modal */}
              <Field>
                <FieldLabel>Category Image</FieldLabel>
                <input
                  type="file"
                  className="cursor-pointer text-xs hover:text-green-600"
                  onChange={handleImageChange}
                />
              </Field>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { formEdit.reset(); setImageFile(null); setIsEditModalOpen(false); }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Category
                </Button>
              </div>
            </FieldSet>
          </form>
        </DialogContent>
      </Dialog>

      {/* [CHANGELOG] Added Delete AlertDialog — identical to delete user dialog in Users.tsx */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold">{selectedCategory?.name}</span>'s category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* [CHANGELOG] Added View Category Dialog — same layout as view user dialog in Users.tsx */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Category Details</DialogTitle>
            <DialogDescription>View complete category information</DialogDescription>
          </DialogHeader>

          {selectedCategory && (
            <div className="space-y-6">
              {/* [CHANGELOG] Image + name header — same as avatar + name in view user dialog */}
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
                  {selectedCategory.image ? (
                    <img
                      src={selectedCategory.image}
                      alt={selectedCategory.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedCategory.name}</h3>
                  <Badge className={cn("capitalize mt-2", getCategoryTypeColor(selectedCategory.categoryType))}>
                    {selectedCategory.categoryType.replace(/-/g, " ")}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Category ID</Label>
                  <p className="text-lg font-semibold">{selectedCategory._id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Created At</Label>
                  <p>{new Date(selectedCategory.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;