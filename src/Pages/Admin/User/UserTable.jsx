import React from 'react';

const UserTable = ({ data = [], onEdit }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700 font-normal">
        <thead className="bg-blue-600 text-white font-medium">
          <tr>
            <th className="py-2 px-4 text-left">Nama</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-center">Role</th>
            <th className="py-2 px-4 text-left">Permissions</th>
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="5" className="py-4 text-center text-gray-400">
                Tidak ada data user.
              </td>
            </tr>
          ) : (
            data.map((usr, index) => (
              <tr key={usr.id} className="even:bg-gray-100 odd:bg-white border-b border-gray-100">
                <td className="py-2 px-4 font-medium">{usr.name}</td>
                <td className="py-2 px-4">{usr.email}</td>
                <td className="py-2 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    usr.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {usr.role}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <div className="flex flex-wrap gap-1 max-w-lg">
                    {usr.permission && usr.permission.length > 0 ? (
                      usr.permission.map((perm, pIdx) => (
                        <span key={pIdx} className="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded font-mono border border-blue-100">
                          {perm}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs italic">No permissions</span>
                    )}
                  </div>
                </td>
                <td className="py-2 px-4 text-center">
                  <button 
                    onClick={() => onEdit(usr)} 
                    className="bg-yellow-500 text-white text-sm px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Edit
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

export default UserTable;
