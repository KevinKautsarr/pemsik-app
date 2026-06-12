import React from 'react';
import { useAuthStateContext } from '../../../Utils/Contexts/AuthContext';

const MahasiswaTable = ({ data = [], onEdit, onDelete, onDetail, isLoading, getTotalSks }) => {
  const { user } = useAuthStateContext();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700 font-normal">
        <thead className="bg-blue-600 text-white font-medium">
          <tr>
            <th className="py-2 px-4 text-left">NIM</th>
            <th className="py-2 px-4 text-left">Nama</th>
            <th className="py-2 px-4 text-center">Max SKS</th>
            <th className="py-2 px-4 text-center">SKS Terpakai</th>
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="5" className="py-8 text-center text-gray-500 font-medium">
                <div className="flex justify-center items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Memuat data mahasiswa...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan="5" className="py-4 text-center text-gray-400">
                Tidak ada data mahasiswa.
              </td>
            </tr>
          ) : (
            data.map((mhs, index) => {
              const totalSks = getTotalSks ? getTotalSks(mhs.id) : 0;

              return (
                <tr key={mhs.id || mhs.nim} className="even:bg-gray-100 odd:bg-white border-b border-gray-100">
                  <td className="py-2 px-4 font-medium">{mhs.nim}</td>
                  <td className="py-2 px-4">{mhs.name || mhs.nama}</td>
                  <td className="py-2 px-4 text-center">{mhs.max_sks || "-"}</td>
                  <td className="py-2 px-4 text-center">{totalSks}</td>
                  <td className="py-2 px-4 text-center space-x-2">
                    <button 
                      onClick={() => onDetail(mhs.id || mhs.nim)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition"
                    >
                      Detail
                    </button>
                    {user?.permission?.includes("mahasiswa.update") && (
                      <button 
                        onClick={() => onEdit(mhs)} 
                        className="bg-yellow-500 text-white text-sm px-3 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                    )}
                    {user?.permission?.includes("mahasiswa.delete") && (
                      <button 
                        onClick={() => onDelete(mhs.id)} 
                        className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Hapus
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MahasiswaTable;
