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
