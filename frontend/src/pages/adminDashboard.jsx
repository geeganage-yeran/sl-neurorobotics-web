import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import SideBar from "../components/AdminSidebar";
import AddProduct from "./adminPanel/AddProduct";
import ManageProduct from "./adminPanel/ManageProducts";
import Dashboard from "./adminPanel/Dashboard";
import Users from "./adminPanel/UserManagement";
import FAQ from "./adminPanel/FaqPage";
import Settings from "./adminPanel/Settings";
import { useEffect } from "react";
import api from "../services/api";
import ManageHomepage from "./adminPanel/ManageHomePage";
import OrderManagment from "./adminPanel/OrderManagement";
import Model from "./adminPanel/3DmodelGenerator";


function AdminDashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const verifyUser = async () => {
      try {
        const response = await api.get("/user/me", {
          withCredentials: true,
          timeout: 10000,
        });

        if (response.data.success && isMounted) {
          setUser(response.data.userInfo);
        } else if (isMounted) {
          navigate("/login", { replace: true });
        }
      } catch (err) {
        if (isMounted) {
          console.error("Auth verification failed:", err);
          navigate("/login", { replace: true });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    verifyUser();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <SideBar activePage={activePage} setActivePage={setActivePage} />

      <div className="lg:ml-75 xl:ml-85 ml-20">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/manageproduct" element={<ManageProduct />} />
          <Route path="/users" element={<Users />} />
          <Route path="/FAQ" element={<FAQ user={user} />} />
          <Route path="/settings" element={<Settings user={user} />} />
          <Route path="/ordermanagement" element={<OrderManagment />} />
          <Route path="/managehomepage" element={<ManageHomepage />} />
          <Route path="/3dmodelgenerator" element={<Model />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </>
  );
}

export default AdminDashboard;
