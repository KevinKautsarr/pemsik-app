import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import Mahasiswa from "./Pages/Admin/Mahasiswa/Mahasiswa";
import MahasiswaDetail from "./Pages/Admin/MahasiswaDetail";
import Dosen from "./Pages/Admin/Dosen/Dosen";
import Matakuliah from "./Pages/Admin/Matakuliah/Matakuliah";
import Kelas from "./Pages/Admin/Kelas/Kelas";
import User from "./Pages/Admin/User/User";
import Dashboard from "./Pages/Admin/Dashboard";
import PageNotFound from "./Pages/Error/PageNotFound";
import AuthLayout from "./Components/Organisms/AuthLayout";
import AdminLayout from "./Components/Organisms/AdminLayout";
import ProtectedRoute from "./Components/ProtectedRoute";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "mahasiswa",
        children: [
          {
            index: true,
            element: <Mahasiswa />,
          },
          {
            path: ":id",
            element: <MahasiswaDetail />,
          },
        ],
      },
      {
        path: "dosen",
        element: <Dosen />,
      },
      {
        path: "matakuliah",
        element: <Matakuliah />,
      },
      {
        path: "kelas",
        element: <Kelas />,
      },
      {
        path: "user",
        element: <User />,
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
