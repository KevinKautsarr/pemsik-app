import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Auth/Login";
import Mahasiswa from "./Pages/Admin/Mahasiswa";
import MahasiswaDetail from "./Pages/Admin/MahasiswaDetail";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Navigate to="/admin/mahasiswa" replace />} />
        <Route path="/admin/mahasiswa" element={<Mahasiswa />} />
        <Route path="/admin/mahasiswa/:nim" element={<MahasiswaDetail />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
