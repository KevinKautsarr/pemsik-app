import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { confirmLogout } from '../../Utils/Helpers/SwalHelpers';
import { useAuthStateContext } from '../../Utils/Contexts/AuthContext';

const Header = ({ onMenuClick, title = "Mahasiswa" }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useAuthStateContext();

  const handleLogout = () => {
    confirmLogout(() => {
      setUser(null); // Clear context and localStorage
      navigate('/login');
    });
  };

  return (
    <header className="bg-white shadow-md z-40">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="p-1 text-gray-600 hover:text-blue-600 rounded transition-all"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-gray-500 hidden sm:inline">
              Login sebagai: <strong className="text-blue-600 capitalize">{user.role}</strong> ({user.name})
            </span>
          )}
          
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-8 h-8 rounded-full bg-gray-300 focus:outline-none hover:ring-2 hover:ring-blue-300 transition-all flex items-center justify-center text-sm font-semibold text-gray-700 capitalize"
            >
              {user?.name ? user.name.charAt(0) : "U"}
            </button>
            
            {isProfileOpen && (
              <div 
                id="profileMenu" 
                className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 border border-gray-100"
              >
                <div className="px-4 py-1 border-b border-gray-100 text-xs text-gray-400 capitalize">
                  {user?.role} Account
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-normal"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
