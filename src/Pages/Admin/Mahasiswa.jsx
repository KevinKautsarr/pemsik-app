import React, { useState, useMemo } from 'react';
import { 
  Plus, Edit, Trash2, Search, Filter, Database, 
  GraduationCap, ArrowRight, CheckCircle2, XCircle, 
  BookOpen, Calculator, MoreVertical 
} from 'lucide-react';
import AdminLayout from '../../Components/organisms/AdminLayout';
import Card from '../../Components/molecules/Card';
import Button from '../../Components/atoms/Button';
import Modal from '../../Components/organisms/Modal';
import Form from '../../Components/molecules/Form';

const Mahasiswa = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data Dummy from original admin.html logic
  const initialStudents = [
    { id: 1, nim: "20211002", nama: "Kevin Kautsar", status: true, ips: 3.85 },
    { id: 2, nim: "20211003", nama: "Muhammad Kevin", status: true, ips: 3.50 },
    { id: 3, nim: "20211001", nama: "Muhammad Kevin Kautsar", status: true, ips: 3.90 },
    { id: 4, nim: "20211005", nama: "Muhammad", status: false, ips: 2.75 },
    { id: 5, nim: "20211003", nama: "Kevin", status: true, ips: 3.20 },
  ];

  const [students, setStudents] = useState(initialStudents);
  const [formData, setFormData] = useState({ nim: '', nama: '', status: true, ips: 0 });

  // Filtering Logic
  const filteredStudents = useMemo(() => {
    return students.filter(student => 
      student.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.nim.includes(searchTerm)
    );
  }, [students, searchTerm]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleAdd = () => {
    setEditingStudent(null);
    setFormData({ nim: '', nama: '', status: true, ips: 0 });
    setIsModalOpen(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData(student);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Execute data termination for this entity?")) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) {
      setStudents(students.map(s => s.id === editingStudent.id ? { ...formData } : s));
    } else {
      setStudents([...students, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const gpaStats = useMemo(() => {
    const total = students.reduce((acc, s) => acc + parseFloat(s.ips || 0), 0);
    return (total / students.length).toFixed(2);
  }, [students]);

  return (
    <AdminLayout pageTitle="Cyber-Physical Data Integration">
      <div className="space-y-12 pb-24">
        
        {/* Real-time Telemetry Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-white border-l-8 border-blue-600 group hover:shadow-2xl transition-all duration-500">
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                <Database size={28} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Archive.01</span>
            </div>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none mb-3">Stored Entities</p>
            <div className="flex items-end gap-3 font-black text-slate-900 leading-none tracking-tighter">
              <span className="text-6xl">{students.length}</span>
              <span className="text-sm text-blue-600 mb-2 italic">Active Units</span>
            </div>
          </Card>
          
          <Card className="bg-slate-900 border-none relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 shadow-2xl shadow-blue-900/40">
            <div className="absolute top-0 right-0 p-8">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400/40">Processor.X</span>
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between pt-4">
              <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-10 border border-white/10">
                <Calculator size={28} />
              </div>
              <div>
                <p className="text-xs font-black text-blue-300/60 uppercase tracking-[0.2em] mb-3">Mean Performance Index</p>
                <div className="flex items-center gap-4 text-5xl font-black text-white leading-none tracking-tighter">
                  {gpaStats} <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/40 font-mono tracking-widest uppercase">Global_Avg</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white group hover:border-blue-200 transition-all duration-500 relative overflow-hidden">
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <ArrowRight size={28} />
              </div>
              <button 
                onClick={handleAdd}
                className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:scale-110 active:scale-95 transition-all"
              >
                <Plus size={20} />
              </button>
            </div>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none mb-4 italic">Injection Protocol</p>
            <h3 className="text-3xl font-black text-slate-900 leading-none -tracking-widest flex items-center gap-3">
              Register <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">New Unit</span>
            </h3>
          </Card>
        </div>

        {/* Neural Network Control Interface */}
        <div className="flex flex-col xl:flex-row justify-between items-center gap-8 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20">
          <div className="flex items-center gap-5 w-full xl:w-auto">
            <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 w-full md:w-[36rem] focus-within:ring-8 focus-within:ring-blue-100 transition-all border-l-4 border-l-blue-500">
              <Search size={22} className="text-slate-400 mr-4" />
              <input 
                type="text" 
                placeholder="PROBE DATABASE VIA HEX-ID OR ENTITY NAME..." 
                className="bg-transparent outline-none text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 placeholder:text-slate-300 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4 w-full xl:w-auto">
             <Button variant="secondary" className="flex items-center gap-3 py-4 px-8 rounded-2xl group border-2">
                <Filter size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
             </Button>
             <Button variant="primary" onClick={handleAdd} className="flex-1 xl:flex-none flex items-center justify-center gap-4 py-4 px-12 rounded-2xl shadow-2xl shadow-blue-600/30">
                <Plus size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Initialize Unit</span>
             </Button>
          </div>
        </div>

        {/* Persistence Layer Matrix */}
        <Card noPadding className="border-none shadow-2xl shadow-blue-900/5">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 uppercase tracking-[0.3em] text-[10px] font-black text-slate-400">
                  <th className="px-12 py-8">Logic_ID (NIM)</th>
                  <th className="px-12 py-8">Entity_Structure</th>
                  <th className="px-12 py-8 text-center">Status_Node</th>
                  <th className="px-12 py-8 text-center">Index_Val</th>
                  <th className="px-12 py-8 text-right">Matrix_Op</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-blue-50/30 transition-all group">
                    <td className="px-12 py-8">
                      <div className="flex items-center gap-5">
                        <span className="w-2 h-2 bg-blue-600 rounded-full group-hover:scale-150 transition-all duration-500"></span>
                        <p className="text-xl font-black text-slate-900 tracking-tighter leading-none">{student.nim}</p>
                      </div>
                    </td>
                    <td className="px-12 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] flex items-center justify-center font-black text-slate-400 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-2xl group-hover:shadow-blue-600/40 transition-all duration-700">
                          {student.nama.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-xl font-black text-slate-900 tracking-tighter leading-none mb-2">{student.nama}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] italic">Full Legal Unit</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-8">
                      <div className="flex justify-center">
                        {student.status ? (
                          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                            <CheckCircle2 size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-500 rounded-xl border border-rose-100 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
                            <XCircle size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Off-Grid</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-12 py-8">
                       <div className="flex flex-col items-center">
                          <p className={`text-xl font-black italic tracking-tighter ${parseFloat(student.ips) >= 3.5 ? 'text-blue-600' : 'text-slate-400'}`}>
                            {parseFloat(student.ips).toFixed(2)}
                          </p>
                          <div className="w-12 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                             <div 
                                className="h-full bg-blue-600 transition-all duration-1000" 
                                style={{ width: `${(parseFloat(student.ips) / 4) * 100}%` }}
                             ></div>
                          </div>
                       </div>
                    </td>
                    <td className="px-12 py-8">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-10 group-hover:translate-x-0 duration-500">
                        <button 
                          onClick={() => handleEdit(student)}
                          className="w-12 h-12 flex items-center justify-center bg-white hover:bg-slate-900 hover:text-white text-slate-400 rounded-2xl border border-slate-100 transition-all shadow-xl shadow-slate-200/20"
                        >
                          <Edit size={20} />
                        </button>
                        <button 
                          onClick={() => handleDelete(student.id)}
                          className="w-12 h-12 flex items-center justify-center bg-white hover:bg-rose-600 hover:text-white text-rose-500 rounded-2xl border border-slate-100 transition-all shadow-xl shadow-slate-200/20"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredStudents.length === 0 && (
            <div className="p-24 text-center">
              <Search size={48} className="mx-auto text-slate-200 mb-6 animate-bounce" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">No matching entities found in matrix</p>
            </div>
          )}
        </Card>
      </div>

      {/* Control Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingStudent ? "OVERRIDE UNIT DATA" : "INITIALIZE ENTITY"}
      >
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <Form 
            label="Logical ID (NIM)" 
            name="nim" 
            value={formData.nim} 
            onChange={handleInputChange} 
            placeholder="2021100X" 
            required
          />
          <Form 
            label="Authorized Unit Name" 
            name="nama" 
            value={formData.nama} 
            onChange={handleInputChange} 
            placeholder="MUHAMMAD KEVIN" 
            required
          />
          
          <div className="grid grid-cols-2 gap-6">
            <Form 
              label="Performance Index (IPS)" 
              name="ips" 
              type="number"
              step="0.01"
              value={formData.ips} 
              onChange={handleInputChange} 
            />
            <div className="flex flex-col">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 leading-none">Network Status</label>
              <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-blue-50 transition-colors">
                <input 
                  type="checkbox" 
                  name="status"
                  checked={formData.status}
                  onChange={handleInputChange}
                  className="w-6 h-6 rounded-lg text-blue-600 focus:ring-blue-500 border-2"
                />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Active Link</span>
              </label>
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest">Abort Protocol</Button>
            <Button variant="primary" onClick={handleSubmit} className="flex-1 py-5 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/40">Push Override</Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default Mahasiswa;
