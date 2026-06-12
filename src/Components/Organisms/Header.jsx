import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { confirmLogout } from '../../Utils/Helpers/SwalHelpers';

const Header = ({ onMenuClick, title = "Mahasiswa" }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    confirmLogout(() => {
      localStorage.removeItem("user");
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
        
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-8 h-8 rounded-full bg-gray-300 focus:outline-none hover:ring-2 hover:ring-blue-300 transition-all"
          >
          </button>
          
          {isProfileOpen && (
            <div 
              id="profileMenu" 
              className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 border border-gray-100"
            >
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
                Profile
              </a>
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
    </header>
  );
};

export default Header;
