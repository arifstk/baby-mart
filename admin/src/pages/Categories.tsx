// // categories page
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
// import { categorySchema } from "@/lib/validation";
// import useAuthStore from "@/store/useAuthStore";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Loader2, Package, Plus, RefreshCw, Search, Upload } from "lucide-react";
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
//   const [sortOrder, setSortOrder] = useState('asc');
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [categoryTypeFilter, setCategoryTypeFilter] = useState<string>("all");
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
//   const [formLoading, setFormLoading] = useState(false);

//   const axiosPrivate = useAxiosPrivate();
//   const { checkIsAdmin } = useAuthStore();
//   const isAdmin = checkIsAdmin();

//   const formAdd = useForm<CategoryFormData>({
//     resolver: zodResolver(categorySchema),
//     defaultValues: {
//       name: "",
//       image: undefined,
//       categoryType: "Featured",
//     },
//   });

//   const formEdit = useForm<CategoryFormData>({
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
//       const response = await axiosPrivate.get('/categories', {
//         params: { page, perPage, sortOrder },
//       });
//       // console.log("Response", response);
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

//   // handle Refresh
//   const handleRefresh = async () => {
//     setRefreshing(true);
//     try {
//       const response = await axiosPrivate.get("/categories", {
//         params: {
//           page, perPage, sortOrder,
//           search: searchTerm.trim() || undefined,
//           categoryType:
//             categoryTypeFilter === "all" ? undefined : categoryTypeFilter,
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
//     setPage(1); // Reset page to 1 when searching
//   };

//   const handleSortOrderChange = (value: string) => {
//     setSortOrder(value as "asc" | "desc");
//     setPage(1);
//   }

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
//             <RefreshCw />{refreshing ? "Refreshing..." : "Refresh"}
//           </Button>
//           <div className="flex items-center gap-2">
//             <Package className="h-8 w-8 text-blue-600" />
//             <span className="text-2xl font-semibold text-blue-600">{total}</span>
//           </div>
//         </div>
//       </div>
//       {/* Filter */}
//       <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
//         <div className="flex items-center gap-4 text-wrap">
//           <div className="flex items-center gap-2">
//             <Search />
//             <Input placeholder="Search Categories..."
//               value={searchTerm}
//               onChange={(e) => handleSearchChange(e.target.value)}
//               className="w-64" />
//           </div>
//           <Select
//             value={categoryTypeFilter}
//             onValueChange={setCategoryTypeFilter}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Filter by Type" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all" onClick={() => setCategoryTypeFilter("all")}>
//                 All Types
//               </SelectItem>
//               <SelectItem value="Featured" onClick={() => setCategoryTypeFilter("Featured")}>
//                 Featured
//               </SelectItem>
//               <SelectItem value="Hot-Categories" onClick={() => setCategoryTypeFilter("Hot-Categories")}>
//                 Hot-Categories
//               </SelectItem>
//               <SelectItem value="Top-Categories" onClick={() => setCategoryTypeFilter("Top-Categories")}>
//                 Top-Categories
//               </SelectItem>
//             </SelectContent>
//           </Select>

//           <Select
//             value={sortOrder}
//             onValueChange={handleSortOrderChange}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Newest / Oldest" />
//             </SelectTrigger>
//             <SelectContent>
//               {/* <SelectItem value="all" onClick={() => setCategoryTypeFilter("all")}>
//                 All Types
//               </SelectItem> */}
//               <SelectItem value="asc" onClick={() => handleSortOrderChange("Newest First")}>
//                 Newest First
//               </SelectItem>
//               <SelectItem value="desc" onClick={() => handleSortOrderChange("Oldest Last")}>
//                 Oldest Last
//               </SelectItem>
//             </SelectContent>
//           </Select>

//           <Button onClick={() => setIsAddModalOpen(true)}>
//             <Plus className="h-4 w-4 mr-1" /> Add Category
//           </Button>
//         </div>
//       </div>
//       {/* Add Category Modal */}
//       {/* <Dialog>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Add Category</DialogTitle>
//             <DialogDescription>Create a new Product category</DialogDescription>
//           </DialogHeader>

//         </DialogContent>
//       </Dialog> */}

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
//   )
// }

// export default Categories



// categories page
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { categorySchema } from "@/lib/validation";
import useAuthStore from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Package, Plus, RefreshCw, Search, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Category } from "type";
import type z from "zod";

type CategoryFormData = z.infer<typeof categorySchema>;

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
  const [formLoading, setFormLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const axiosPrivate = useAxiosPrivate();
  const { checkIsAdmin } = useAuthStore();
  const isAdmin = checkIsAdmin();

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

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600 mt-1">Manage product categories and their organization</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <div className="flex items-center gap-2">
            <Package className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-semibold text-blue-600">{total}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4 mt-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Search />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-64"
            />
          </div>

          <Select value={categoryTypeFilter} onValueChange={setCategoryTypeFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Featured">Featured</SelectItem>
              <SelectItem value="Hot-Categories">Hot Categories</SelectItem>
              <SelectItem value="Top-Categories">Top Categories</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={handleSortOrderChange}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Newest First</SelectItem>
              <SelectItem value="desc">Oldest Last</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Category
          </Button>
        </div>
      </div>

      {/* Add Category Modal */}
      <Dialog
        open={isAddModalOpen}
        onOpenChange={(open) => {
          if (!open) { reset(); setImageFile(null); }
          setIsAddModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-137 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Add Category</DialogTitle>
            <DialogDescription>Create a new product category</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldSet>
              {/* Name */}
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input {...register("name")} placeholder="Category name" />
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>

              {/* Category Type */}
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

              {/* Category Image */}
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
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </label>
              </Field>

              {/* Footer */}
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
    </div>
  );
};

export default Categories;
