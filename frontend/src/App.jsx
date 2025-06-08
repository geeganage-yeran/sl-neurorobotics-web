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
