// Brands.tsx

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Plus, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/imageUpload";

import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import useAuthStore from "@/store/useAuthStore";
import type { Brand } from "type";

/* -----------------------------
   Form Type (NO ZOD HERE)
-------------------------------- */
type BrandFormData = {
  name: string;
  image?: File;
};

const Brands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const { checkIsAdmin } = useAuthStore();
  const isAdmin = checkIsAdmin();

  /* -----------------------------
     React Hook Form
  -------------------------------- */
  const formAdd = useForm<BrandFormData>({
    defaultValues: {
      name: "",
      image: undefined,
    },
  });

  /* -----------------------------
     Fetch Brands
  -------------------------------- */
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await axiosPrivate.get("/brands");
      setBrands(res.data);
    } catch (err) {
      toast.error("Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  /* -----------------------------
     Refresh
  -------------------------------- */
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const res = await axiosPrivate.get("/brands");
      setBrands(res.data);
      toast.success("Brands refreshed");
    } catch {
      toast.error("Refresh failed");
    } finally {
      setRefreshing(false);
    }
  };

  /* -----------------------------
     Create Brand
  -------------------------------- */
  const handleAddBrand = async (data: BrandFormData) => {
    setFormLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);

      if (data.image) {
        formData.append("image", data.image);
      }

      await axiosPrivate.post("/brands", formData);

      toast.success("Brand created successfully");
      formAdd.reset();
      setIsAddModalOpen(false);
      fetchBrands();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create brand");
    } finally {
      setFormLoading(false);
    }
  };

  /* -----------------------------
     UI
  -------------------------------- */
  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Brands</h1>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCcw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""
                }`}
            />
            Refresh
          </Button>

          {isAdmin && (
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Brand
            </Button>
          )}
        </div>
      </div>

      {/* BRANDS LIST */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : brands.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No brands found
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {brands.map((brand) => (
            <div
              key={brand._id}
              className="border rounded-xl p-4 flex flex-col items-center gap-3 hover:shadow-sm transition"
            >
              {/* IMAGE */}
              <div className="h-24 w-24 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                {brand.image ? (
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No Image
                  </span>
                )}
              </div>

              {/* NAME */}
              <p className="font-medium text-center">{brand.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* ADD BRAND MODAL */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Brand</DialogTitle>
            <DialogDescription>
              Create a brand with optional image
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={formAdd.handleSubmit(handleAddBrand)}>
            <FieldSet>
              {/* NAME */}
              <Field>
                <FieldLabel>Brand Name</FieldLabel>
                <Input
                  {...formAdd.register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters"
                    }
                  })}
                  placeholder="Enter brand name"
                  disabled={formLoading}
                />
                <FieldError>
                  {formAdd.formState.errors.name?.message}
                </FieldError>
              </Field>

              {/* IMAGE */}
              <Field>
                <FieldLabel>Brand Image (optional)</FieldLabel>
                <ImageUpload
                  onChange={(file) => {
                    console.log("Image selected:", file);
                    formAdd.setValue("image", file, {
                      shouldValidate: true,
                      shouldDirty: true
                    });
                  }}
                  disabled={formLoading}
                />
                <FieldError>
                  {formAdd.formState.errors.image?.message as string}
                </FieldError>
              </Field>
            </FieldSet>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddModalOpen(false);
                  formAdd.reset();
                }}
                disabled={formLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Brand
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Brands;