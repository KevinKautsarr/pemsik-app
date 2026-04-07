import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const AdminLayout = ({ children, pageTitle }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex bg-slate-50 min-h-screen selection:bg-blue-100">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          title={pageTitle}
        />
        
        <main className="flex-1 p-8 lg:p-14 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
