import React from 'react';
import { useAuthStateContext } from '../../../Utils/Contexts/AuthContext';

const MatakuliahTable = ({ data = [], onEdit, onDelete, isLoading }) => {
  const { user } = useAuthStateContext();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700 font-normal">
        <thead className="bg-blue-600 text-white font-medium">
          <tr>
            <th className="py-2 px-4 text-left">Kode MK</th>
            <th className="py-2 px-4 text-left">Nama Mata Kuliah</th>
            <th className="py-2 px-4 text-center">SKS</th>
            <th className="py-2 px-4 text-center">Semester</th>
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="5" className="py-8 text-center text-gray-500 font-medium">
                <div className="flex justify-center items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Memuat data mata kuliah...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan="5" className="py-4 text-center text-gray-400">
                Tidak ada data mata kuliah.
              </td>
            </tr>
          ) : (
            data.map((mk, index) => (
              <tr key={mk.id || mk.kodemk} className="even:bg-gray-100 odd:bg-white border-b border-gray-100">
                <td className="py-2 px-4 font-medium">{mk.kodemk}</td>
                <td className="py-2 px-4">{mk.nama}</td>
                <td className="py-2 px-4 text-center">{mk.sks}</td>
                <td className="py-2 px-4 text-center">{mk.semester}</td>
                <td className="py-2 px-4 text-center space-x-2">
                  {user?.permission?.includes("matakuliah.update") && (
                    <button 
                      onClick={() => onEdit(mk)} 
                      className="bg-yellow-500 text-white text-sm px-3 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                  )}
                  {user?.permission?.includes("matakuliah.delete") && (
                    <button 
                      onClick={() => onDelete(mk.id)} 
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

export default MatakuliahTable;
