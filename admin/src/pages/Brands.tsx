// Brands.tsx

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import type { brandSchema } from "@/lib/validation";
import useAuthStore from "@/store/useAuthStore";
import { Plus, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Brand } from "type";
import type z from "zod";


type FormData = z.infer<typeof brandSchema>

const Brands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  //check isAdmin ??
  const { checkIsAdmin } = useAuthStore();
  const isAdmin = checkIsAdmin();

  // check brands on mount
  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get("/brands");
      // console.log("response", response?.data);
      setBrands(response?.data);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
      toast.error("Failed to fetch brands. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      const response = await axiosPrivate.get("/brands");
      setBrands(response?.data);
      toast.success("Brands refreshed successfully");
    } catch (error) {
      console.log("Failed to refresh brands:", error);
      toast.error("Failed to refresh brands");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Brands</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            variant={"outline"} disabled={refreshing}>
            <RefreshCcw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />{refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          {isAdmin &&
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />Add Brand
            </Button>}
        </div>
      </div>
      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Brand</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new brand.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Brands
