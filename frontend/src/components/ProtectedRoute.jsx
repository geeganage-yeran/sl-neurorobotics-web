import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Page403 from "../pages/403Page";
import api from "../services/api"

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: null,
    loading: true,
    user: null,
    showForbidden: false,
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/user/me", {
          withCredentials: true,
          timeout: 10000,
        });

        if (response.data.success) {
          setAuthState({
            isAuthenticated: true,
            loading: false,
            user: response.data.userInfo,
            showForbidden: false,
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            loading: false,
            showForbidden: false,
            user: null,
          });
        }
      } catch (error) {
        if (error.response?.status === 403) {
          setAuthState({
            isAuthenticated: false,
            loading: false,
            user: null,
            showForbidden: true,
          });
          return;
        }

        //If not 403
        setAuthState({
          isAuthenticated: false,
          loading: false,
          user: null,
          showForbidden: false,
        });
      }
    };

    checkAuth();
  }, []);

  //Navigation after auth state set
  useEffect(() => {
    if (authState.loading || authState.showForbidden) return;

    if (!authState.isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    const userRole = authState.user?.role;

    if (userRole) {
      if (userRole === "ADMIN" && location.pathname.startsWith("/dashboard")) {
        navigate("/admin", { replace: true });
        return;
      }

      if (userRole === "USER" && location.pathname.startsWith("/admin")) {
        navigate("/dashboard", { replace: true });
        return;
      }

      if (requiredRole && userRole !== requiredRole) {
        if (userRole === "ADMIN") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
        return;
      }
    }
  }, [authState, location.pathname, navigate, requiredRole]);

  //Show the 403 page
  if (authState.showForbidden) {
    return <Page403 />;
  }

  //loaing animation
  if (authState.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return null;
  }

  if (React.isValidElement(children)) {
    return React.cloneElement(children, { user: authState.user });
  }

  return children;
};

export default ProtectedRoute;
