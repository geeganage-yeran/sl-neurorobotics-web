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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* No authentication needed */}

        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/addcart" element={<AddCart />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/user-reg" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/shop" element={<Shop />}/>
        <Route path="/productview/:id" element={<Productview/>}/>

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

        {/*404 Page catchup */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
