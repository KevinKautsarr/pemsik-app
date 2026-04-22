import React, { useState } from 'react';
import { Search, Bell, ChevronDown, User, Settings, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { confirmLogout } from '../../Utils/Helpers/SwalHelpers';


const Header = ({ onMenuClick, title = "Mahasiswa" }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    confirmLogout(() => {
      navigate('/login');
    });
  };


  return (
    <header className="bg-white/80 backdrop-blur-2xl border-b border-slate-100 px-8 py-5 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-blue-50 transition-all"
        >
          <Menu size={22} />
        </button>
        <div className="flex flex-col">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none mb-2">Workspace</p>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden xl:flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3 w-72 focus-within:ring-4 focus-within:ring-blue-100 transition-all mr-4">
          <Search size={18} className="text-slate-400 mr-3" />
          <input type="text" placeholder="Global search..." className="bg-transparent text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none w-full" />
        </div>

        <button className="p-4 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all relative">
          <Bell size={20} />
          <span className="absolute top-4 right-4 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="relative border-l border-slate-100 pl-4 ml-2">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1 pr-4 bg-blue-600 text-white rounded-[1.25rem] hover:bg-blue-700 transition-all group"
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-black border border-white/20">
              MK
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[9px] font-black uppercase tracking-widest text-blue-100/60 leading-none">Admin</p>
              <p className="text-sm font-black leading-none mt-1">Kevin K. <ChevronDown size={14} className={`inline-block ml-1 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} /></p>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-4 w-60 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="p-6 bg-slate-50/50 border-b border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Signed in as</p>
                <p className="text-sm font-black text-slate-900">Kevin Kautsar</p>
              </div>
              <div className="p-2">
                <button className="flex items-center gap-4 w-full px-5 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-2xl transition-all">
                  <User size={18} /> My Profile
                </button>
                <button className="flex items-center gap-4 w-full px-5 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-2xl transition-all">
                  <Settings size={18} /> Settings
                </button>
                <hr className="my-2 border-slate-50 mx-4" />
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-4 w-full px-5 py-3.5 text-sm font-black text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
