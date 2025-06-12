import { useState } from "react";
import HomePage from "./pages/HomePage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import AddCart from "./pages/addtocart";
import ResourcesPage from './pages/ResourcesPage';
import Userdashboard from "./pages/UserDashboard";



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
      </Routes>
    </BrowserRouter>
  );

}

export default App;
