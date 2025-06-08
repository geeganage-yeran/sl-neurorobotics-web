
import { useState } from 'react'
import AboutUs from './pages/AboutUs'
import "./App.css";
import './index.css'
import Resourses from './pages/Resourses';
import Product from './pages/Product';
import Userdashboard from './pages/Userdashboard';
import { useState } from "react";
import "./App.css";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import AddCart from "./pages/addtocart";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/addcart" element={<AddCart />} />

      </Routes>
    </BrowserRouter>
  );

}

export default App;
