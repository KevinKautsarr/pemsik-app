import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 selection:bg-blue-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
