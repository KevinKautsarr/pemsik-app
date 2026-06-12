import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  // Dynamically resolve page title based on current route path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/mahasiswa')) {
      return "Mahasiswa";
    }
    if (path.includes('/admin/dosen')) {
      return "Dosen";
    }
    if (path.includes('/admin/matakuliah')) {
      return "Mata Kuliah";
    }
    if (path.includes('/admin/user')) {
      return "User Management";
    }
    if (path.includes('/admin/kelas')) {
      return "Kelas";
    }
    return "Dashboard";
  };

  return (
    <div className="flex min-h-screen bg-gray-100 selection:bg-blue-100 w-full">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="flex flex-col flex-1 min-w-0">
        <Header 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          title={getPageTitle()}
        />
        
        <main className="flex-1 p-6 overflow-x-auto">
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
