import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import HeaderV2 from "../components/HeaderV2";
import Product from "./Product";
import UserAccountOverview from "./UserAccountOverview";
import api from "../services/api"
import DynamicHeader from "../components/DynamicHeader"

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await api.get("/user/me", {
          withCredentials: true,
          timeout: 10000,
        });

        if (response.data.success) {
          console.log(response.data.userInfo);
          setUser(response.data.userInfo);
        } else {
          navigate("/login", { replace: true });
        }
      } catch (err) {
        console.error("Auth verification failed:", err);
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <DynamicHeader/>
      <Routes>
        <Route path="/" element={<Product />} />
        <Route path="account/*" element={<UserAccountOverview user={user}/>} />
      </Routes>
    </>
  );
}

export default UserDashboard;
