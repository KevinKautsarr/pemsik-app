import React from 'react';
import { useAuthStateContext } from '../../Utils/Contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuthStateContext();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Selamat Datang, {user?.name || 'User'}!
      </h1>
      <p className="text-gray-600 mt-2">
        {user?.role === 'admin' 
          ? 'Ini adalah halaman utama sistem admin.' 
          : 'Ini adalah halaman utama portal mahasiswa.'}
      </p>
    </div>
  );
};

export default Dashboard;
