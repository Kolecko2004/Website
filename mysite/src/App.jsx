import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profession from "./pages/Profession";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profession" element={<Profession />} />
      </Routes>
      <Footer />
    </div>
  );
}