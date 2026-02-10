import adminApi from "@/lib/config";
import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";

export const useAxiosPrivate = () => {
  const { logout } = useAuthStore();

  useEffect(() => {
    // The auth interceptor is already configured in the admin API
    // we just need to handle logout on 401 errors if needed

    const responseIntercept = adminApi.interceptors.response.use(
      (response:any) => response,
      (error) => {
        if (error?.response?.status === 401) {
          logout();
          // Redirect to login
          window.location.href = "/login";
        }
        return Promise.reject(error);
      },
    );
    return () => {
      adminApi.interceptors.response.eject(responseIntercept);
    };
  }, [logout]);
  return adminApi;
};

// to use User.tsx file
