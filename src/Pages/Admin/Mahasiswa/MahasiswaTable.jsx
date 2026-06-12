import React from 'react';
import { useAuthStateContext } from '../../../Utils/Contexts/AuthContext';

const MahasiswaTable = ({ data = [], onEdit, onDelete, onDetail }) => {
  const { user } = useAuthStateContext();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700 font-normal">
        <thead className="bg-blue-600 text-white font-medium">
          <tr>
            <th className="py-2 px-4 text-left">NIM</th>
            <th className="py-2 px-4 text-left">Nama</th>
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="3" className="py-4 text-center text-gray-400">
                Tidak ada data mahasiswa.
              </td>
            </tr>
          ) : (
            data.map((mhs, index) => (
              <tr key={mhs.id || mhs.nim} className="even:bg-gray-100 odd:bg-white border-b border-gray-100">
                <td className="py-2 px-4 font-medium">{mhs.nim}</td>
                <td className="py-2 px-4">{mhs.nama}</td>
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MahasiswaTable;
