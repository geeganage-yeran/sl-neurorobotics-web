import React from 'react';
import { Routes, Route } from "react-router-dom";
import HeaderV2 from '../components/HeaderV2';
import Product from "./Product";
import UserAccountOverview from './UserAccountOverview';
import ChatBot from '../components/ChatBot'

function UserDashboard() {
  return (
    <>
      <HeaderV2 />
      <Routes>
        <Route path="/" element={<Product />} />
        <Route path="account/*" element={<UserAccountOverview />} />
      </Routes>
      <ChatBot/>
    </>
  );
}

export default UserDashboard;