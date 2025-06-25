import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import SideBar from "../components/AdminSidebar";
import AddProduct from "./adminPanel/addProduct";
import ManageProduct from "./adminPanel/manageProducts"
import Dashboard from "./adminPanel/dashboard";
import Users from "./adminPanel\/userManagement";
import Quotations from "./adminPanel/quotations";
import FAQ from "./adminPanel/FAQ";
import Settings from "./adminPanel/settings";

function AdminDashboard() {
  const [activePage, setActivePage] = useState("Dashboard");

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
          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </>
  );
}

export default AdminDashboard;