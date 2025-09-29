import { useState } from "react";
import HomePage from "./pages/HomePage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import AddCart from "./pages/addtocart";
import ResourcesPage from "./pages/ResourcesPage";
import Userdashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/RegistrationPage";
import Login from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Page404 from "./pages/404Page";
import Shop from "./pages/Product";
import Productview from "./pages/ProductView";
import AddToCart from "./pages/addtocart";
import ProceedToPay from "./pages/proceedToPay";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentFailed from "./components/paymentFail";
import ForgetPassword from "./pages/enterEmail";
import Enterotp from "./pages/enterOTP";
import ChangePassword from "./pages/fogotPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* No authentication needed */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/addcart" element={<AddCart />} />
        {/* <Route path="/resources" element={<ResourcesPage />} /> */}
        <Route path="/user-reg" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/shop" element={<Shop />}/>
        <Route path="/productview/:id" element={<Productview/>}/>
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/enteremail" element={<ForgetPassword />} />
        <Route path="/verify-reset-code" element={<Enterotp />} />
        <Route path="/reset-password" element={<ChangePassword />} />
        
        {/* Authentication needed */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute requiredRole="USER">
              <Userdashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Cart Route */}
        <Route
          path="/cart/:userId"
          element={
            <ProtectedRoute requiredRole="USER">
              <AddToCart />
            </ProtectedRoute>
          }
        />

        {/* NEW: Checkout Route */}
        <Route
          path="/checkout/:userId"
          element={
            <ProtectedRoute requiredRole="USER">
              <ProceedToPay />
            </ProtectedRoute>
          }
        />

        {/* 404 Page catchup - This should be at the end */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;