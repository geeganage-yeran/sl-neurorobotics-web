import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import HeaderV2 from "../components/HeaderV2";
import Product from "./Product";
import UserAccountOverview from "./UserAccountOverview";
import axios from "axios";

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user/me", {
          withCredentials: true,
          timeout: 10000,
        });

        if (response.data.success) {
          setUser(response.data.userInfo);
        } else {
          navigate("/user-log", { replace: true });
        }
      } catch (err) {
        console.error("Auth verification failed:", err);
        navigate("/user-log", { replace: true });
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
      <HeaderV2 />
      <Routes>
        <Route path="/" element={<Product />} />
        <Route path="account/*" element={<UserAccountOverview />} />
      </Routes>
    </>
  );
}

export default UserDashboard;
