import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStateContext } from '../../Utils/Contexts/AuthContext';

const Sidebar = ({ isOpen }) => {
  const { user } = useAuthStateContext();

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: "🏠", permission: "dashboard.page" },
    { label: "Mahasiswa", href: "/admin/mahasiswa", icon: "🎓", permission: "mahasiswa.page" },
    { label: "Dosen", href: "/admin/dosen", icon: "👨‍🏫", permission: "dosen.page" },
    { label: "Mata Kuliah", href: "/admin/matakuliah", icon: "📚", permission: "matakuliah.page" },
    { label: "Kelas", href: "/admin/kelas", icon: "🏫", permission: "kelas.page" },
    { label: "User", href: "/admin/user", icon: "👤", permission: "user.page" },
    { label: "Rencana Studi", href: "/admin/rencana-studi", icon: "📚", permission: "rencana-studi.page" },
  ];

  // Filter menu items based on user permissions
  const filteredMenuItems = menuItems.filter(item => {
    if (!user || !user.permission) return false;
    return user.permission.includes(item.permission);
  });

  return (
    <aside 
      id="sidebar" 
      className={`bg-blue-800 text-white min-h-screen transition-all duration-300 shrink-0 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-blue-700 h-16">
        <span className={`text-xl font-bold transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}>
          {user?.role === 'admin' ? 'Admin Portal' : 'Portal Mhs'}
        </span>
      </div>
      <nav className="p-4 space-y-2">
        {filteredMenuItems.map((item, idx) => (
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
