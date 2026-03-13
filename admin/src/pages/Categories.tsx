// categories page

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { categorySchema, categoryUpdateSchema } from "@/lib/validation";
import useAuthStore from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Edit,
  Eye,
  ImageIcon,
  Loader2,
  Package,
  Plus,
  RefreshCw,
  Search,
  Trash,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Category } from "type";
import type z from "zod";

type CategoryFormData = z.infer<typeof categorySchema>;
type CategoryEditFormData = z.infer<typeof categoryUpdateSchema>;

// ─── Image Upload Field Component 
// Reusable image picker with preview and clear button
const ImageUploadField = ({
  imageFile,
  existingImageUrl,
  onChange,
  onClear,
}: {
  imageFile: File | null;
  existingImageUrl?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const preview = imageFile ? URL.createObjectURL(imageFile) : existingImageUrl;

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="h-28 w-28 rounded-lg object-cover border shadow-sm"
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <label
          className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <div className="bg-gray-100 rounded-full p-3 mb-2">
            <Upload className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-600">Click to upload image</p>
          <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP (max 4MB)</p>
        </label>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={onChange}
      />
      {imageFile && (
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <ImageIcon className="h-3 w-3" />
          {imageFile.name}
        </p>
      )}
    </div>
  );
};

// ─── Main Component
const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryTypeFilter, setCategoryTypeFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Separate image state for add and edit modals
  const [addImageFile, setAddImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  const axiosPrivate = useAxiosPrivate();
  const { checkIsAdmin } = useAuthStore();
  const isAdmin = checkIsAdmin();

  // ── Add form ─
  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", image: undefined, categoryType: "Featured" },
  });

  // ── Edit form ──
  const formEdit = useForm<CategoryEditFormData>({
    resolver: zodResolver(categoryUpdateSchema),
    defaultValues: { name: "", image: undefined, categoryType: "Featured" },
  });

  // ── Fetch ─
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
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, sortOrder]);

  // ── Refresh ─
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
    } catch {
      toast.error("Failed to refresh categories");
    } finally {
      setRefreshing(false);
    }
  };

  // ── Image handlers ─
  const handleAddImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setAddImageFile(e.target.files[0]);
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setEditImageFile(e.target.files[0]);
  };

  // ── Badge color ─
  const getCategoryTypeColor = (type: string) => {
    switch (type) {
      case "Hot-Categories": return "bg-red-100 text-red-800 border-red-200";
      case "Top-Categories": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Featured": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // ── Add submit ─
  const onSubmit = async (data: CategoryFormData) => {
    setFormLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("categoryType", data.categoryType);
      // ✅ FIX: append image file with correct field name "image"
      if (addImageFile) formData.append("image", addImageFile);

      await axiosPrivate.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Category added successfully");
      reset();
      setAddImageFile(null);
      setIsAddModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Failed to create category", error);
      toast.error("Failed to create category");
    } finally {
      setFormLoading(false);
    }
  };

  // ── Edit ──
  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    formEdit.reset({
      name: category.name,
      categoryType: category.categoryType,
      image: undefined,
    });
    setEditImageFile(null);
    setIsEditModalOpen(true);
  };


  const handleUpdateCategory = async (data: CategoryEditFormData) => {
    if (!selectedCategory) return;
    setFormLoading(true);

    try {
      if (editImageFile) {
        const formData = new FormData();
        formData.append("name", data.name);
        if (data.categoryType) {
          formData.append("categoryType", data.categoryType);
        }
        formData.append("image", editImageFile);

        await axiosPrivate.put(`/categories/${selectedCategory._id}`, formData);
      } else {
        await axiosPrivate.put(`/categories/${selectedCategory._id}`, {
          name: data.name,
          categoryType: data.categoryType,
        });
      }

      toast.success("Category updated successfully");
      setIsEditModalOpen(false);
      setEditImageFile(null);
      fetchCategories();
    } catch (error) {
      console.error("Failed to update category", error);
      toast.error("Failed to update category");
    } finally {
      setFormLoading(false);
    }
  };
  // ── Delete ─
  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    setLoading(true);
    try {
      await axiosPrivate.delete(`/categories/${selectedCategory._id}`);
      toast.success("Category deleted successfully");
      setIsDeleteModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category", error);
      toast.error("Failed to delete category");
    }
  };

  // ── View ─
  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setIsViewModalOpen(true);
  };

  // ── Client-side filter ──
  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      categoryTypeFilter === "all" || category.categoryType === categoryTypeFilter;
    return matchesSearch && matchesType;
  });

  // ─────────────
  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900">
            Categories Management
          </h1>
          <p className="text-gray-500 mt-0.5 text-sm">
            Manage product categories and their organization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-blue-600 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg">
            <Package className="w-5 h-5" />
            <p className="text-xl font-bold">{total}</p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <RefreshCw className={cn("mr-1 h-4 w-4", refreshing && "animate-spin")} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          {isAdmin && (
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Category
            </Button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="pl-9 w-60"
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

          <Select value={sortOrder} onValueChange={(v) => { setSortOrder(v); setPage(1); }}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">A → Z</SelectItem>
              <SelectItem value="desc">Z → A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700">Image</TableHead>
              <TableHead className="font-semibold text-gray-700">Name</TableHead>
              <TableHead className="font-semibold text-gray-700">Type</TableHead>
              <TableHead className="font-semibold text-gray-700">Created At</TableHead>
              <TableHead className="font-semibold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-400" />
                  <p className="text-sm text-gray-400 mt-2">Loading categories...</p>
                </TableCell>
              </TableRow>
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <TableRow key={category._id} className="hover:bg-gray-50 transition-colors">
                  <TableCell>
                    <div className="h-11 w-11 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center border">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-gray-300" />
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="font-medium text-gray-900">
                    {category.name}
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={cn(
                        "capitalize border text-xs font-medium",
                        getCategoryTypeColor(category.categoryType)
                      )}
                    >
                      {category.categoryType.replace(/-/g, " ")}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-gray-500 text-sm">
                    {new Date(category.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="View"
                        onClick={() => handleView(category)}
                        className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit"
                        onClick={() => handleEdit(category)}
                        className="h-8 w-8 text-gray-500 hover:text-green-600 hover:bg-green-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        onClick={() => handleDelete(category)}
                        className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <Package className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-gray-400 font-medium">No categories found</p>
                  <p className="text-gray-300 text-sm mt-1">
                    Try adjusting your search or filters
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-sm text-gray-500">
            Page <span className="font-semibold">{page}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* ── Add Category Modal ──── */}
      <Dialog
        open={isAddModalOpen}
        onOpenChange={(open) => {
          if (!open) { reset(); setAddImageFile(null); }
          setIsAddModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add Category</DialogTitle>
            <DialogDescription>Create a new product category</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <FieldSet>
              <Field>
                <FieldLabel>Name <span className="text-red-500">*</span></FieldLabel>
                <Input {...register("name")} placeholder="e.g. Baby Clothing" />
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel>Category Type <span className="text-red-500">*</span></FieldLabel>
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
                {errors.categoryType && (
                  <FieldError>{errors.categoryType.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>Category Image <span className="text-gray-400 font-normal">(Optional)</span></FieldLabel>
                {/* ✅ FIX: Separated add/edit image state so they don't conflict */}
                <ImageUploadField
                  imageFile={addImageFile}
                  onChange={handleAddImageChange}
                  onClear={() => setAddImageFile(null)}
                />
              </Field>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { reset(); setAddImageFile(null); setIsAddModalOpen(false); }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Category
                </Button>
              </div>
            </FieldSet>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Edit Category Modal ──── */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) { formEdit.reset(); setEditImageFile(null); }
          setIsEditModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Category</DialogTitle>
            <DialogDescription>Update category details</DialogDescription>
          </DialogHeader>

          <form onSubmit={formEdit.handleSubmit(handleUpdateCategory)} className="space-y-4 mt-2">
            <FieldSet>
              <Field>
                <FieldLabel>Name <span className="text-red-500">*</span></FieldLabel>
                <Input {...formEdit.register("name")} placeholder="Category name" />
                {formEdit.formState.errors.name && (
                  <FieldError>{formEdit.formState.errors.name.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>Category Type</FieldLabel>
                <Select
                  value={formEdit.watch("categoryType")}
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

              <Field>
                <FieldLabel>Category Image</FieldLabel>
                {/* ✅ FIX: Shows existing Cloudinary image as preview, separate state from add modal */}
                <ImageUploadField
                  imageFile={editImageFile}
                  existingImageUrl={selectedCategory?.image}
                  onChange={handleEditImageChange}
                  onClear={() => setEditImageFile(null)}
                />
                {!editImageFile && selectedCategory?.image && (
                  <p className="text-xs text-gray-400">
                    Upload a new image to replace the current one
                  </p>
                )}
              </Field>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { formEdit.reset(); setEditImageFile(null); setIsEditModalOpen(false); }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Category
                </Button>
              </div>
            </FieldSet>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete AlertDialog ─────── */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-semibold text-gray-800">
                {selectedCategory?.name}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── View Category Dialog ── */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Category Details</DialogTitle>
            <DialogDescription>Full category information</DialogDescription>
          </DialogHeader>

          {selectedCategory && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border shadow-sm shrink-0">
                  {selectedCategory.image ? (
                    <img
                      src={selectedCategory.image}
                      alt={selectedCategory.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-8 w-8 text-gray-300" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedCategory.name}
                  </h3>
                  <Badge
                    className={cn(
                      "capitalize mt-1 border text-xs",
                      getCategoryTypeColor(selectedCategory.categoryType)
                    )}
                  >
                    {selectedCategory.categoryType.replace(/-/g, " ")}
                  </Badge>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                <div>
                  <Label className="text-xs text-gray-400 uppercase tracking-wide">
                    Category ID
                  </Label>
                  <p className="font-mono text-gray-700 text-xs mt-0.5 break-all">
                    {selectedCategory._id}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-400 uppercase tracking-wide">
                    Created At
                  </Label>
                  <p className="text-gray-700 mt-0.5">
                    {new Date(selectedCategory.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
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

