
// Products.tsx
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
import useAuthStore from "@/store/useAuthStore";
import {
  Edit,
  Loader2,
  Package,
  Plus,
  RefreshCw,
  Star,
  Trash,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Brand, Category, Product } from "type";

// ── Local form state types (what we send to the API) ─────────────────────────
// The API receives IDs for category/brand, but Product type stores full objects.
// We keep form state separate from the Product interface.
interface ProductFormState {
  name: string;
  description: string;
  price: number;
  discountPercentage: number;
  stock: number;
  categoryId: string;
  brandId: string;
}

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  price: 0,
  discountPercentage: 0,
  stock: 0,
  categoryId: "",
  brandId: "",
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Controlled form state — no react-hook-form needed since we own all field types
  const [addForm, setAddForm] = useState<ProductFormState>(emptyForm);
  const [editForm, setEditForm] = useState<ProductFormState>(emptyForm);

  const axiosPrivate = useAxiosPrivate();
  const { checkIsAdmin } = useAuthStore();
  const isAdmin = checkIsAdmin();

  // ── Fetch products ─
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get("/products", {
        params: { page, perPage, sortOrder },
      });
      setProducts(response?.data?.products || []);
      setTotal(response?.data?.total || 0);
      setTotalPages(response?.data?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch categories & brands for select dropdowns ───
  const fetchCategoriesAndBrands = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        axiosPrivate.get("/categories", { params: { perPage: 100 } }),
        axiosPrivate.get("/brands", { params: { perPage: 100 } }),
      ]);
      setCategories(catRes?.data?.categories || []);
      setBrands(brandRes?.data?.brands || []);
    } catch (error) {
      console.error("Error fetching categories/brands:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, sortOrder]);

  useEffect(() => {
    fetchCategoriesAndBrands();
  }, []);

  // ── Refresh ──
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await axiosPrivate.get("/products", {
        params: { page, perPage, sortOrder },
      });
      setProducts(response?.data?.products || []);
      setTotal(response?.data?.total || 0);
      setTotalPages(response?.data?.totalPages || 1);
      toast.success("Products refreshed");
    } catch (error) {
      console.error("Failed to refresh products", error);
      toast.error("Failed to refresh products");
    } finally {
      setRefreshing(false);
    }
  };

  const handleSortOrderChange = (value: string) => {
    setSortOrder(value as "asc" | "desc");
    setPage(1);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
  };

  // ── Add product ──
  // const handleAddSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setFormLoading(true);
  //   try {
  //     const formData = new FormData();
  //     formData.append("name", addForm.name);
  //     formData.append("description", addForm.description);
  //     formData.append("price", String(addForm.price));
  //     formData.append("discountPercentage", String(addForm.discountPercentage));
  //     formData.append("stock", String(addForm.stock));
  //     formData.append("categoryId", addForm.categoryId);
  //     formData.append("brandId", addForm.brandId);
  //     if (imageFile) formData.append("image", imageFile);

  //     await axiosPrivate.post("/products", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     toast.success("✅ Product added successfully");
  //     setAddForm(emptyForm);
  //     setImageFile(null);
  //     setIsAddModalOpen(false);
  //     fetchProducts();
  //   } catch (error) {
  //     console.error("Failed to create product", error);
  //     toast.error("Failed to create product");
  //   } finally {
  //     setFormLoading(false);
  //   }
  // };

  const handleAddSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!addForm.categoryId) {
    toast.error("Please select a category");
    return;
  }
  if (!addForm.brandId) {
    toast.error("Please select a brand");
    return;
  }

  setFormLoading(true);
  try {
    const formData = new FormData();
    formData.append("name", addForm.name);
    formData.append("description", addForm.description);
    formData.append("price", String(addForm.price));
    formData.append("discountPercentage", String(addForm.discountPercentage));
    formData.append("stock", String(addForm.stock));
    formData.append("categoryId", addForm.categoryId);
    formData.append("brandId", addForm.brandId);
    if (imageFile) formData.append("image", imageFile);

    await axiosPrivate.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("✅ Product added successfully");
    setAddForm(emptyForm);
    setImageFile(null);
    setIsAddModalOpen(false);
    fetchProducts();
  } catch (error) {
    console.error("Failed to create product", error);
    toast.error("Failed to create product");
  } finally {
    setFormLoading(false);
  }
};

  // ── Edit product ──
  // product.category and product.brand are full objects 
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPercentage: product.discountPercentage,
      stock: product.stock,
      categoryId: product.category._id,
      brandId: product.brand._id,
    });
    setImageFile(null);
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setFormLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("description", editForm.description);
      formData.append("price", String(editForm.price));
      formData.append("discountPercentage", String(editForm.discountPercentage));
      formData.append("stock", String(editForm.stock));
      formData.append("categoryId", editForm.categoryId);
      formData.append("brandId", editForm.brandId);
      if (imageFile) formData.append("image", imageFile);

      await axiosPrivate.put(`/products/${selectedProduct._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product updated successfully");
      setIsEditModalOpen(false);
      setImageFile(null);
      fetchProducts();
    } catch (error) {
      console.error("Failed to update product", error);
      toast.error("Failed to update product");
    } finally {
      setFormLoading(false);
    }
  };

  // ── Delete product ───
  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    try {
      await axiosPrivate.delete(`/products/${selectedProduct._id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product", error);
      toast.error("Failed to delete product");
    }
  };

  // ── Badge color helpers ─
  const getDiscountColor = (discount: number) => {
    if (discount >= 15) return "bg-red-100 text-red-800";
    if (discount >= 10) return "bg-orange-100 text-orange-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const getStockColor = (stock: number) => {
    if (stock <= 5) return "bg-red-100 text-red-800";
    if (stock <= 15) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  // ── Shared form fields (used in both Add and Edit modals) ────────────────────
  const renderFormFields = (
    form: ProductFormState,
    setForm: React.Dispatch<React.SetStateAction<ProductFormState>>,
    isEdit = false
  ) => (
    <FieldSet>
      <Field>
        <FieldLabel>Product Name</FieldLabel>
        <Input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Product name"
          required
        />
      </Field>

      <Field>
        <FieldLabel>Description</FieldLabel>
        <Input
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Product description"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Price ($)</FieldLabel>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) =>
              setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))
            }
            placeholder="0.00"
            required
          />
        </Field>

        <Field>
          <FieldLabel>Discount (%)</FieldLabel>
          <Input
            type="number"
            min="0"
            max="100"
            value={form.discountPercentage}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                discountPercentage: parseInt(e.target.value) || 0,
              }))
            }
            placeholder="0"
          />
        </Field>
      </div>

      <Field>
        <FieldLabel>Stock</FieldLabel>
        <Input
          type="number"
          min="0"
          value={form.stock}
          onChange={(e) =>
            setForm((f) => ({ ...f, stock: parseInt(e.target.value) || 0 }))
          }
          placeholder="0"
          required
        />
      </Field>

      <Field>
        <FieldLabel>Category</FieldLabel>
        <Select
          value={form.categoryId}
          onValueChange={(value) => setForm((f) => ({ ...f, categoryId: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent position="popper">
            {categories.map((cat: Category) => (
              <SelectItem key={cat._id} value={cat._id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel>Brand</FieldLabel>
        <Select
          value={form.brandId}
          onValueChange={(value) => setForm((f) => ({ ...f, brandId: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select brand" />
          </SelectTrigger>
          <SelectContent position="popper">
            {brands.map((brand: Brand) => (
              <SelectItem key={brand._id} value={brand._id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel>Product Image {!isEdit && "(Optional)"}</FieldLabel>
        {isEdit ? (
          <input
            type="file"
            accept="image/*"
            className="cursor-pointer text-xs hover:text-green-600"
            onChange={handleImageChange}
          />
        ) : (
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
        )}
      </Field>
    </FieldSet>
  );

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">
          Products{" "}
          <span className="text-base font-normal text-gray-500">Total {total}</span>
        </h1>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className={`mr-1.5 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>

          <Select value={sortOrder} onValueChange={handleSortOrderChange}>
            <SelectTrigger className="w-40 border-gray-300">
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>

          {isAdmin && (
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gray-900 text-white hover:bg-gray-700"
            >
              <Plus className="mr-1 h-4 w-4" /> Add Product
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100">
              <TableHead className="font-semibold text-gray-700">Image</TableHead>
              <TableHead className="font-semibold text-gray-700">Name</TableHead>
              <TableHead className="font-semibold text-gray-700">Price</TableHead>
              <TableHead className="font-semibold text-gray-700">Discount</TableHead>
              <TableHead className="font-semibold text-gray-700">Stock</TableHead>
              <TableHead className="font-semibold text-gray-700">Rating</TableHead>
              <TableHead className="font-semibold text-gray-700">Category</TableHead>
              <TableHead className="font-semibold text-gray-700">Brand</TableHead>
              <TableHead className="font-semibold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                </TableCell>
              </TableRow>
            ) : products.length > 0 ? (
              products.map((product: Product) => (
                <TableRow
                  key={product._id}
                  className="border-b border-gray-50 hover:bg-gray-50/50"
                >
                  {/* Image */}
                  <TableCell>
                    <div className="h-12 w-12 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </TableCell>

                  {/* Name — truncated */}
                  <TableCell className="font-medium text-gray-900 max-w-50">
                    <span className="truncate block" title={product.name}>
                      {product.name.length > 25
                        ? product.name.slice(0, 25) + "..."
                        : product.name}
                    </span>
                  </TableCell>

                  {/* Price */}
                  <TableCell className="text-green-600 font-semibold">
                    ${product.price.toFixed(2)}
                  </TableCell>

                  {/* discountPercentage from Product interface */}
                  <TableCell>
                    <Badge
                      className={cn(
                        "font-medium",
                        getDiscountColor(product.discountPercentage)
                      )}
                    >
                      {product.discountPercentage}%
                    </Badge>
                  </TableCell>

                  {/* Stock */}
                  <TableCell>
                    <Badge
                      className={cn("font-medium", getStockColor(product.stock))}
                    >
                      {product.stock}
                    </Badge>
                  </TableCell>

                  {/* averageRating from Product interface */}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-gray-700">
                        {product.averageRating.toFixed(1)}
                      </span>
                    </div>
                  </TableCell>

                  {/* category.name — nested Category object */}
                  <TableCell>
                    <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
                      {product.category.name}
                    </Badge>
                  </TableCell>

                  {/* brand.name — nested Brand object */}
                  <TableCell>
                    <Badge className="bg-purple-50 text-purple-700 border border-purple-200">
                      {product.brand.name}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit product"
                        className="border border-border hover:bg-gray-100"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete product"
                        className="border border-border hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDelete(product)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-lg font-semibold p-5 text-gray-500">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
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

      {/* ── Add Product Modal ───────────────────────────────────────────────────── */}
      <Dialog
        open={isAddModalOpen}
        onOpenChange={(open) => {
          if (!open) { setAddForm(emptyForm); setImageFile(null); }
          setIsAddModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Add Product</DialogTitle>
            <DialogDescription>Create a new product listing</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit}>
            {renderFormFields(addForm, setAddForm, false)}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAddForm(emptyForm);
                  setImageFile(null);
                  setIsAddModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Product
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Edit Product Modal ──────────────────────────────────────────────────── */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) { setEditForm(emptyForm); setImageFile(null); }
          setIsEditModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Edit Product</DialogTitle>
            <DialogDescription>Update existing product details</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateSubmit}>
            {renderFormFields(editForm, setEditForm, true)}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditForm(emptyForm);
                  setImageFile(null);
                  setIsEditModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Product
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete AlertDialog ──────────────────────────────────────────────────── */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold">{selectedProduct?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Products;