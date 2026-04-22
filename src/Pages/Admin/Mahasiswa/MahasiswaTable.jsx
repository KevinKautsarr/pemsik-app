import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../Components/Molecules/Card';
import { CheckCircle2, XCircle } from 'lucide-react';

const MahasiswaTable = ({ mahasiswa, openEditModal, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = (nim) => {
    onDelete(nim);
  };


  return (
    <Card noPadding>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4">NIM</th>
              <th className="px-6 py-4">Entity Name</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">IPS</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mahasiswa.map((mhs) => (
              <tr key={mhs.nim} className="hover:bg-blue-50/50 transition-colors group">
                <td className="px-6 py-4 font-bold">{mhs.nim}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {mhs.nama.charAt(0)}
                    </div>
                    <span className="font-bold">{mhs.nama}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {mhs.status ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase">
                      <CheckCircle2 size={12} /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-[9px] font-black uppercase">
                      <XCircle size={12} /> Off-Grid
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center font-mono font-bold">
                  {parseFloat(mhs.ips).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => navigate(`/admin/mahasiswa/${mhs.nim}`)} 
                      className="p-2 hover:bg-blue-600 hover:text-white text-blue-600 rounded-lg border transition-all"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => openEditModal(mhs)} 
                      className="p-2 hover:bg-slate-900 hover:text-white rounded-lg border transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(mhs.nim)} 
                      className="p-2 hover:bg-rose-600 hover:text-white text-rose-600 rounded-lg border transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default MahasiswaTable;
