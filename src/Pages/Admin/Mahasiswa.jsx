import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, Search, Database, 
  CheckCircle2, XCircle, Calculator, Eye 
} from 'lucide-react';

// Import sesuai standarisasi materi Anda
import AdminLayout from '../../Components/Organisms/AdminLayout';
import Card from '../../Components/Molecules/Card';
import Button from '../../Components/Atoms/Button';
import Modal from '../../Components/Organisms/Modal'; 

import Input from "../../Components/Atoms/Input"; 
import Label from "../../Components/Atoms/Label";
// Import data dummy awal
import { mahasiswaList } from '../../Data/Dummy';

const Mahasiswa = () => {
  const navigate = useNavigate();
  // --- STATE MANAGEMENT (Sesuai Materi) ---
  const [mahasiswa, setMahasiswa] = useState([]); // State utama data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State Form (Object sesuai materi)
  const [form, setForm] = useState({
    nim: '',
    nama: '',
    status: true,
    ips: 0
  });

  // --- USEEFFECT: LOAD DATA (Sesuai Materi) ---
  useEffect(() => {
    // Simulasi fetch data saat komponen dimount
    const fetchMahasiswa = () => {
      setMahasiswa(mahasiswaList);
    };
    fetchMahasiswa();
  }, []);

  // --- LOGIKA FILTERING ---
  const filteredMahasiswa = useMemo(() => {
    return mahasiswa.filter(m => 
      m.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.nim.includes(searchTerm)
    );
  }, [mahasiswa, searchTerm]);

  // --- EVENT HANDLING (Sesuai Materi) ---
  
  // 1. HandleChange: Menangkap perubahan input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  // 2. Fungsi CRUD Dasar
  const addMahasiswa = (newData) => {
    setMahasiswa([...mahasiswa, { ...newData, id: Date.now() }]);
  };

  const updateMahasiswa = (nim, newData) => {
    const updated = mahasiswa.map((m) => 
      m.nim === nim ? { ...m, ...newData } : m
    );
    setMahasiswa(updated);
  };

  const deleteMahasiswa = (nim) => {
    const filtered = mahasiswa.filter((m) => m.nim !== nim);
    setMahasiswa(filtered);
  };

  // 3. Handle Modal Open
  const openAddModal = () => {
    setForm({ nim: '', nama: '', status: true, ips: 0 });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleEdit = (mhs) => {
    setForm({ ...mhs });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleDelete = (nim) => {
    if (window.confirm("Yakin ingin hapus data ini? (Data Termination)")) {
      deleteMahasiswa(nim);
    }
  };

  // 4. HandleSubmit (Update & Create dengan Validasi)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi: Data kurang terisi
    if (!form.nim || !form.nama) {
      alert("NIM dan Nama wajib diisi!");
      return;
    }

    if (isEdit) {
      // Validasi Konfirmasi Update
      if (window.confirm("Simpan perubahan data mahasiswa?")) {
        updateMahasiswa(form.nim, form);
        setIsModalOpen(false);
      }
    } else {
      // Validasi: NIM Unique
      const exists = mahasiswa.find((m) => m.nim === form.nim);
      if (exists) {
        alert("Gagal: NIM sudah terdaftar!");
        return;
      }
      addMahasiswa(form);
      setIsModalOpen(false);
    }
  };

  // Statistik IPS
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

        {/* Table Mahasiswa (Read) */}
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
                {filteredMahasiswa.map((mhs) => (
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
                        <button onClick={() => navigate(`/admin/mahasiswa/${mhs.nim}`)} className="p-2 hover:bg-blue-600 hover:text-white text-blue-600 rounded-lg border transition-all">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleEdit(mhs)} className="p-2 hover:bg-slate-900 hover:text-white rounded-lg border transition-all">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(mhs.nim)} className="p-2 hover:bg-rose-600 hover:text-white text-rose-600 rounded-lg border transition-all">
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
      </div>

      {/* Modal Form (Sesuai Materi) */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isEdit ? "OVERRIDE UNIT DATA" : "INITIALIZE ENTITY"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nim">Logical ID (NIM)</Label>
            <Input 
              name="nim"
              value={form.nim}
              onChange={handleChange}
              readOnly={isEdit} // NIM tidak bisa diubah saat edit
              placeholder="Ex: 20211001"
              required
            />
          </div>
          <div>
            <Label htmlFor="nama">Entity Name</Label>
            <Input 
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Ex: Muhammad Kevin"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ips">Performance Index</Label>
              <Input 
                name="ips"
                type="number"
                step="0.01"
                value={form.ips}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Network Status</Label>
              <label className="flex items-center gap-2 mt-3 cursor-pointer">
                <input 
                  type="checkbox"
                  name="status"
                  checked={form.status}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Active Link</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Abort</Button>
            <Button type="submit" className="flex-1">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default Mahasiswa;