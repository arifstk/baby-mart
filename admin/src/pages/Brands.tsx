// Brands.tsx

import { Button } from "@/components/ui/button";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import type { brandSchema } from "@/lib/validation";
import { RefreshCcw } from "lucide-react";
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
  const 

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
  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold mb-4">Brands</h1>
        <div>
          <Button variant={"outline"} disabled={refreshing}>
            <RefreshCcw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />{refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          {isAdmin}
        </div>
      </div>
    </div>
  )
}

export default Brands
