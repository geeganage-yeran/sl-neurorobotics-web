import { useState } from "react";
import HomePage from "./pages/HomePage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import AddCart from "./pages/addtocart";
import ResourcesPage from "./pages/ResourcesPage";
import Userdashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/reg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/addcart" element={<AddCart />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/dashboard/*" element={<Userdashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/reg" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
