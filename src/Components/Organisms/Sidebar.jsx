import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: "🏠" },
    { label: "Mahasiswa", href: "/admin/mahasiswa", icon: "🎓" },
    { label: "Dosen", href: "/admin/dosen", icon: "👨‍🏫" },
    { label: "Mata Kuliah", href: "/admin/matakuliah", icon: "📚" },
  ];

  return (
    <aside 
      id="sidebar" 
      className={`bg-blue-800 text-white min-h-screen transition-all duration-300 shrink-0 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-blue-700 h-16">
        <span className={`text-2xl font-bold transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}>
          Admin
        </span>
      </div>
      <nav className="p-4 space-y-2">
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.href}
            end={item.href === '/admin'}
            className={({ isActive }) => `flex items-center space-x-2 px-4 py-2 rounded transition-all ${
              isActive 
                ? 'bg-blue-700 text-white font-semibold' 
                : 'hover:bg-blue-700 text-blue-100 hover:text-white'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className={`menu-text transition-opacity duration-300 ${isOpen ? 'inline' : 'hidden'}`}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
