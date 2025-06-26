import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import SideBar from "../components/AdminSidebar";
import AddProduct from "./adminPanel/addProduct";
import ManageProduct from "./adminPanel/manageProducts";
import Dashboard from "./adminPanel/dashboard";
import Users from "./adminPanel/userManagement";
import Quotations from "./adminPanel/quotations";
import FAQ from "./adminPanel/FQApage";
import Settings from "./adminPanel/settings";
import { useEffect } from "react";
import api from "../services/api";

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
          <Route path="/quotations" element={<Quotations />} />
          <Route path="/FAQ" element={<FAQ user={user} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </>
  );
}

export default AdminDashboard;
