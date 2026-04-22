import React, { useState, useEffect, useMemo } from 'react';
import { Database, Calculator, Plus, Search } from 'lucide-react';
import AdminLayout from '../../../Components/Organisms/AdminLayout';
import Card from '../../../Components/Molecules/Card';
import Button from '../../../Components/Atoms/Button';
import { mahasiswaList } from '../../../Data/Dummy';
import MahasiswaTable from './MahasiswaTable';
import MahasiswaModal from './MahasiswaModal';
import { confirmDelete, confirmUpdate } from '../../../Utils/Helpers/SwalHelpers';
import { toastSuccess, toastError } from '../../../Utils/Helpers/ToastHelpers';


const Mahasiswa = () => {
  // --- STATE MANAGEMENT ---
  const [mahasiswa, setMahasiswa] = useState([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    setMahasiswa(mahasiswaList);
  }, []);

  // --- CRUD LOGIC ---
  const storeMahasiswa = (newData) => {
    // Check if NIM already exists
    const exists = mahasiswa.find((m) => m.nim === newData.nim);
    if (exists) {
      toastError("Gagal: NIM sudah terdaftar!");
      return;
    }
    setMahasiswa([...mahasiswa, newData]);
    toastSuccess("Data mahasiswa berhasil ditambahkan");
  };


  const updateMahasiswa = (newData) => {
    confirmUpdate(() => {
      const updated = mahasiswa.map((m) => 
        m.nim === selectedMahasiswa.nim ? { ...m, ...newData } : m
      );
      setMahasiswa(updated);
      toastSuccess("Data berhasil diperbarui");
    });
  };


  const deleteMahasiswa = (nim) => {
    const filtered = mahasiswa.filter((m) => m.nim !== nim);
    setMahasiswa(filtered);
  };

  // --- MODAL HANDLERS ---
  const openAddModal = () => {
    setSelectedMahasiswa(null);
    setModalOpen(true);
  };

  const openEditModal = (mhs) => {
    setSelectedMahasiswa(mhs);
    setModalOpen(true);
  };

  const handleSubmit = (formData) => {
    if (selectedMahasiswa) {
      updateMahasiswa(formData);
    } else {
      storeMahasiswa(formData);
    }
  };

  const handleDelete = (nim) => {
    confirmDelete(() => {
      deleteMahasiswa(nim);
      toastSuccess("Data berhasil dihapus");
    });
  };


  // --- STATS & FILTERING ---
  const filteredMahasiswa = useMemo(() => {
    return mahasiswa.filter(m => 
      m.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.nim.includes(searchTerm)
    );
  }, [mahasiswa, searchTerm]);

  const gpaStats = useMemo(() => {
    if (mahasiswa.length === 0) return "0.00";
    const total = mahasiswa.reduce((acc, m) => acc + parseFloat(m.ips || 0), 0);
    return (total / mahasiswa.length).toFixed(2);
  }, [mahasiswa]);

  return (
    <AdminLayout pageTitle="Cyber-Physical Data Integration">
      <div className="space-y-8 pb-20">
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-blue-600">
             <div className="flex justify-between items-center">
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Unit</p>
                   <h3 className="text-4xl font-black">{mahasiswa.length}</h3>
                </div>
                <Database className="text-blue-600" size={32} />
             </div>
          </Card>
          <Card className="bg-slate-900 text-white">
             <div className="flex justify-between items-center">
                <div>
                   <p className="text-xs font-bold text-blue-300/60 uppercase tracking-widest">Global Avg IPS</p>
                   <h3 className="text-4xl font-black">{gpaStats}</h3>
                </div>
                <Calculator className="text-white/20" size={32} />
             </div>
          </Card>
          <Card className="flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-all" onClick={openAddModal}>
             <div className="text-center">
                <Plus className="mx-auto text-blue-600 mb-2" size={32} />
                <p className="font-black text-xs uppercase tracking-tighter">Initialize New Unit</p>
             </div>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center bg-white border rounded-2xl px-4 py-2 shadow-sm">
            <Search size={20} className="text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="PROBE DATABASE (NIM/NAMA)..." 
              className="w-full outline-none text-xs font-bold uppercase"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={openAddModal} className="px-8">Initialize</Button>
        </div>

        {/* Table Mahasiswa */}
        <MahasiswaTable 
          mahasiswa={filteredMahasiswa} 
          openEditModal={openEditModal} 
          onDelete={handleDelete} 
        />
      </div>

      {/* Modal Form */}
      <MahasiswaModal 
        isModalOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        selectedMahasiswa={selectedMahasiswa}
      />
    </AdminLayout>
  );
};

export default Mahasiswa;
