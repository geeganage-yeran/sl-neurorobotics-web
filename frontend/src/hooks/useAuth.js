import { useEffect, useState } from "react";
import api from "../services/api";

const useAuth = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    loading: true,
    user: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/user/me", {
          withCredentials: true,
          timeout: 10000,
          validateStatus: function (status) {
            return status < 500;
          }
        });

        if (response.status === 200 && response.data.success) {
          setAuthState({
            isAuthenticated: true,
            loading: false,
            user: response.data.userInfo,
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            loading: false,
            user: null,
          });
        }
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {

        } else {
          console.error("Unexpected auth error:", error);
        }
        
        setAuthState({
          isAuthenticated: false,
          loading: false,
          user: null,
        });
      }
    };

    checkAuth();
  }, []);

  return authState;
};

export default useAuth;