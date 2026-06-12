import React from 'react';

const DosenTable = ({ data = [], onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700 font-normal">
        <thead className="bg-blue-600 text-white font-medium">
          <tr>
            <th className="py-2 px-4 text-left">NIDN</th>
            <th className="py-2 px-4 text-left">Nama</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Bidang</th>
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="5" className="py-4 text-center text-gray-400">
                Tidak ada data dosen.
              </td>
            </tr>
          ) : (
            data.map((dsn, index) => (
              <tr key={dsn.id || dsn.nidn} className="even:bg-gray-100 odd:bg-white border-b border-gray-100">
                <td className="py-2 px-4 font-medium">{dsn.nidn}</td>
                <td className="py-2 px-4">{dsn.nama}</td>
                <td className="py-2 px-4">{dsn.email}</td>
                <td className="py-2 px-4">{dsn.bidang}</td>
                <td className="py-2 px-4 text-center space-x-2">
                  <button 
                    onClick={() => onEdit(dsn)} 
                    className="bg-yellow-500 text-white text-sm px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onDelete(dsn.id)} 
                    className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DosenTable;
