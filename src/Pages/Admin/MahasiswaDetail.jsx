import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../Components/Organisms/AdminLayout';
import Card from '../../Components/Molecules/Card';
import Button from '../../Components/Atoms/Button';
import { mahasiswaList } from '../../Data/Dummy';
import { ArrowLeft, User, Shield, Activity } from 'lucide-react';

const MahasiswaDetail = () => {
  const { nim } = useParams();
  const navigate = useNavigate();

  // Mencari data berdasarkan NIM dari URL
  const data = mahasiswaList.find((m) => m.nim === nim);

  if (!data) {
    return (
      <AdminLayout pageTitle="Entity Not Found">
        <div className="text-center py-20">
          <h2 className="text-2xl font-black text-slate-900 mb-4">DATA NOT FOUND</h2>
          <Button onClick={() => navigate('/admin/mahasiswa')}>Back to Database</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Entity Detailed Analysis">
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
                {data.nama.charAt(0)}
             </div>
             <h2 className="text-2xl font-black text-slate-900 tracking-tighter">{data.nama}</h2>
             <p className="text-slate-400 font-bold tracking-widest uppercase text-[10px] mt-2">Logical Unit {data.nim}</p>
          </Card>

          <Card className="lg:col-span-2">
             <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                   <User className="text-blue-600" size={24} />
                   <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Full Name</p>
                      <p className="font-bold text-slate-900">{data.nama}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                   <Shield className="text-blue-600" size={24} />
                   <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Identifier (NIM)</p>
                      <p className="font-bold text-slate-900">{data.nim}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                   <Activity className="text-blue-600" size={24} />
                   <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Status</p>
                      <p className={`font-bold ${data.status ? 'text-emerald-600' : 'text-rose-600'}`}>
                         {data.status ? 'ACTIVE LINK' : 'OFF-GRID'}
                      </p>
                   </div>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MahasiswaDetail;
