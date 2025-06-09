
import { useState } from 'react'
import AboutUs from './pages/AboutUs'
import "./App.css";
import './index.css'
import Resourses from './pages/Resourses';
import Product from './pages/Product';
import Userdashboard from './pages/Userdashboard';

function App() {
  

  return (
    <>
    </>
  )

import { useState } from "react";
import "./App.css";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import { Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );

}

export default App;
