import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../Components/Molecules/Card';
import Button from '../../Components/Atoms/Button';
import { getMahasiswa } from '../../Utils/Apis/MahasiswaApi';
import { ArrowLeft, User, Shield, Activity } from 'lucide-react';
import { toastError } from '../../Utils/Helpers/ToastHelpers';

const MahasiswaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mahasiswa, setMahasiswa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMahasiswa();
  }, [id]);

  const fetchMahasiswa = async () => {
    try {
      const res = await getMahasiswa(id);
      setMahasiswa(res.data);
    } catch (err) {
      toastError("Gagal mengambil data mahasiswa");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Memuat data...</p>
      </div>
    );
  }

  if (!mahasiswa) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">DATA NOT FOUND</h2>
        <Button onClick={() => navigate('/admin/mahasiswa')}>Back to Database</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Button 
        variant="secondary" 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2"
      >
        <ArrowLeft size={16} /> Return to Registry
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 flex flex-col items-center justify-center p-12 text-center">
           <div className="w-32 h-32 rounded-[2.5rem] bg-blue-600 text-white flex items-center justify-center text-5xl font-black mb-6 shadow-2xl shadow-blue-200">
              {mahasiswa.nama ? mahasiswa.nama.charAt(0) : ''}
           </div>
           <h2 className="text-2xl font-black text-slate-900 tracking-tighter">{mahasiswa.nama}</h2>
           <p className="text-slate-400 font-bold tracking-widest uppercase text-[10px] mt-2">Logical Unit {mahasiswa.nim}</p>
        </Card>

        <Card className="lg:col-span-2">
           <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                 <User className="text-blue-600" size={24} />
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">Full Name</p>
                    <p className="font-bold text-slate-900">{mahasiswa.nama}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                 <Shield className="text-blue-600" size={24} />
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">Identifier (NIM)</p>
                    <p className="font-bold text-slate-900">{mahasiswa.nim}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                 <Activity className="text-blue-600" size={24} />
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">Status</p>
                    <p className={`font-bold ${mahasiswa.status ? 'text-emerald-600' : 'text-rose-600'}`}>
                       {mahasiswa.status ? 'ACTIVE LINK' : 'OFF-GRID'}
                    </p>
                 </div>
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default MahasiswaDetail;
