import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Users, Settings, LogOut, Hexagon } from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutGrid },
    { label: "Mahasiswa", href: "/admin/mahasiswa", icon: Users },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className={`bg-blue-800 text-white min-h-screen transition-all duration-700 flex flex-col shadow-2xl sticky top-0 z-50 ${isOpen ? 'w-80' : 'w-28'}`}>
      <div className="p-10 flex items-center gap-5 border-b border-white/5 mb-10 overflow-hidden">
        <div className="w-14 h-14 bg-white/10 rounded-[1.25rem] flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
          <Hexagon className="text-blue-300" size={32} />
        </div>
        <div className={`transition-all duration-700 whitespace-nowrap ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
          <h1 className="text-3xl font-black tracking-tighter leading-none italic">ADMIN<span className="text-blue-300">.</span></h1>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-300/40 mt-1">v1.2.0</p>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-3">
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.href}
            end={item.href === '/admin'}
            className={({ isActive }) => `flex items-center gap-5 px-6 py-5 rounded-[1.75rem] transition-all duration-500 group relative ${
              isActive 
                ? 'bg-white text-blue-800 shadow-2xl shadow-blue-900/50 font-black' 
                : 'text-blue-100/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <item.icon size={26} className={`shrink-0 transition-all duration-500 ${isOpen ? '' : 'mx-auto'} group-hover:scale-110`} />
            <span className={`text-[13px] font-bold tracking-wide transition-all duration-700 uppercase whitespace-nowrap overflow-hidden ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
              {item.label}
            </span>
            {!isOpen && (
              <div className="absolute left-full ml-6 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100] shadow-2xl">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-8 border-t border-white/5 mx-4 mt-auto mb-6">
        <button className="flex items-center gap-5 w-full px-6 py-5 rounded-[1.75rem] bg-rose-500/10 text-rose-300/80 hover:bg-rose-500 hover:text-white transition-all font-black group relative">
          <LogOut size={26} className={`shrink-0 transition-all duration-500 ${isOpen ? '' : 'mx-auto'}`} />
          <span className={`text-[13px] font-black tracking-widest uppercase transition-all duration-700 overflow-hidden ${isOpen ? 'opacity-100 w-auto ml-1' : 'opacity-0 w-0'}`}>
            Logout
          </span>
          {!isOpen && (
            <div className="absolute left-full ml-10 px-4 py-2 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100] shadow-2xl">
              Log Out
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
