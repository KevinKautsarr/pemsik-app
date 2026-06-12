import React from 'react';
import { useAuthStateContext } from '../../../Utils/Contexts/AuthContext';

const KelasTable = ({ data = [], onEdit, onDelete, isLoading }) => {
  const { user } = useAuthStateContext();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700 font-normal">
        <thead className="bg-blue-600 text-white font-medium">
          <tr>
            <th className="py-2 px-4 text-left w-16">No</th>
            <th className="py-2 px-4 text-left">Nama Kelas</th>
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="3" className="py-8 text-center text-gray-500 font-medium">
                <div className="flex justify-center items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Memuat data kelas...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan="3" className="py-4 text-center text-gray-400">
                Tidak ada data kelas.
              </td>
            </tr>
          ) : (
            data.map((kls, index) => (
              <tr key={kls.id} className="even:bg-gray-100 odd:bg-white border-b border-gray-100">
                <td className="py-2 px-4 font-medium">{index + 1}</td>
                <td className="py-2 px-4">{kls.nama}</td>
                <td className="py-2 px-4 text-center space-x-2">
                  {user?.permission?.includes("kelas.update") && (
                    <button 
                      onClick={() => onEdit(kls)} 
                      className="bg-yellow-500 text-white text-sm px-3 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                  )}
                  {user?.permission?.includes("kelas.delete") && (
                    <button 
                      onClick={() => onDelete(kls.id)} 
                      className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Hapus
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default KelasTable;
