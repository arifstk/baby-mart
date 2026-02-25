// // Brands.tsx

// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
// import { ImageUpload } from "@/components/ui/imageUpload";
// import { Input } from "@/components/ui/input";
// import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
// import { brandSchema } from "@/lib/validation";
// import useAuthStore from "@/store/useAuthStore";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Loader2, Plus, RefreshCcw } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import type { Brand } from "type";
// import type z from "zod";


// // type FormData = z.infer<typeof brandSchema>
//  type FormData = {
//     name: string;
//     image?: File;
//   };

// const Brands = () => {
//   const [brands, setBrands] = useState<Brand[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
//   const [formLoading, setFormLoading] = useState(false);
//   const axiosPrivate = useAxiosPrivate();

//   //check isAdmin ??
//   const { checkIsAdmin } = useAuthStore();
//   const isAdmin = checkIsAdmin();

//   // form states (Add)
//   const formAdd = useForm<FormData>({
//     resolver: zodResolver(brandSchema),
//     defaultValues: {
//       name: "",
//       image: undefined,
//     },
//   });

//   // form states (Edit)
//   // const formEdit = useForm<FormData>({
//   //   resolver: zodResolver(brandSchema),
//   //   defaultValues: {
//   //     name: "",
//   //     image: "",
//   //   },
//   // });

//   // check brands on mount
//   const fetchBrands = async () => {
//     setLoading(true);
//     try {
//       const response = await axiosPrivate.get("/brands");
//       // console.log("response", response?.data);
//       setBrands(response?.data);
//     } catch (error) {
//       console.error("Failed to fetch brands:", error);
//       toast.error("Failed to fetch brands. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = async () => {
//     try {
//       const response = await axiosPrivate.get("/brands");
//       setBrands(response?.data);
//       toast.success("Brands refreshed successfully");
//     } catch (error) {
//       console.log("Failed to refresh brands:", error);
//       toast.error("Failed to refresh brands");
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchBrands();
//   }, []);

//   // Add brand 
//   const handleAddBrand = async (data: FormData) => {
//     setFormLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("name", data.name);

//       if (data.image instanceof File) {
//         formData.append("image", data.image);
//       }

//       await axiosPrivate.post("/brands", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       toast.success("Brand created successfully");
//       formAdd.reset();
//       setIsAddModalOpen(false);
//       fetchBrands();
//     } catch (error) {
//       console.error("Create brand failed:", error);
//       toast.error("Failed to create brand");
//     } finally {
//       setFormLoading(false);
//     }
//   };
//   console.log("Brands", brands);


//   return (
//     <div className="space-y-6 p-4">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold">Brands</h1>
//         <div className="flex items-center gap-2">
//           <Button
//             onClick={handleRefresh}
//             variant={"outline"} disabled={refreshing}>
//             <RefreshCcw
//               className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
//             />{refreshing ? "Refreshing..." : "Refresh"}
//           </Button>
//           {isAdmin &&
//             <Button onClick={() => setIsAddModalOpen(true)}>
//               <Plus className="mr-2 h-4 w-4" />Add Brand
//             </Button>}
//         </div>
//       </div>
//       {/* Add Modal */}
//       <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Add New Brand</DialogTitle>
//             <DialogDescription>
//               Fill in the details to add a new brand.
//             </DialogDescription>
//           </DialogHeader>

//           <form onSubmit={formAdd.handleSubmit(handleAddBrand)}>
//             <FieldSet>
//               {/* Brand Name */}
//               <Field>
//                 <FieldLabel>Name</FieldLabel>
//                 <Input
//                   {...formAdd.register("name")}
//                   placeholder="Brand name"
//                   disabled={formLoading}
//                 />
//                 <FieldError>
//                   {formAdd.formState.errors.name?.message}
//                 </FieldError>
//               </Field>

//               {/* Brand Image */}
//               <Field>
//                 <FieldLabel>Brand Image (optional)</FieldLabel>
//                 {/* <ImageUpload
//                   value={formAdd.watch("image") ?? ""}
//                   onChange={(value) => formAdd.setValue("image", value)}
//                   disabled={formLoading}
//                 /> */}
//                 <ImageUpload
//                   onChange={(file) => formAdd.setValue("image", file)}
//                   disabled={formLoading}
//                 />
//                 <FieldError>
//                   {formAdd.formState.errors.image?.message}
//                 </FieldError>
//               </Field>
//             </FieldSet>

//             {/* FOOTER */}
//             <div className="flex justify-end gap-3 pt-4">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => setIsAddModalOpen(false)}
//                 disabled={formLoading}
//               >
//                 Cancel
//               </Button>

//               <Button type="submit" disabled={formLoading}>
//                 {formLoading && (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 )}
//                 Create Brand
//               </Button>
//             </div>
//           </form>

//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Brands



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
                  {...formAdd.register("name", { required: "Name is required" })}
                  placeholder="Brand name"
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
                  disabled={formLoading}
                  onChange={(file) =>
                    formAdd.setValue("image", file, {
                      shouldDirty: true,
                    })
                  }
                />
              </Field>
            </FieldSet>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                disabled={formLoading}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={formLoading}>
                {formLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
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