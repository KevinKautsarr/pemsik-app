import React, { useState } from 'react';
import MatakuliahTable from './MatakuliahTable';
import MatakuliahModal from './MatakuliahModal';
import { confirmDelete, confirmUpdate } from '../../../Utils/Helpers/SwalHelpers';
import { toastError } from '../../../Utils/Helpers/ToastHelpers';
import { useAuthStateContext } from '../../../Utils/Contexts/AuthContext';
import {
  useMataKuliah,
  useStoreMataKuliah,
  useUpdateMataKuliah,
  useDeleteMataKuliah
} from '../../../Utils/Hooks/useMataKuliah';

const Matakuliah = () => {
  const { user } = useAuthStateContext();

  // --- REACT QUERY DATA FETCHING ---
  const { data: matakuliah = [], isLoading: isMataKuliahLoading } = useMataKuliah();

  // --- REACT QUERY MUTATIONS ---
  const { mutate: store } = useStoreMataKuliah();
  const { mutate: update } = useUpdateMataKuliah();
  const { mutate: remove } = useDeleteMataKuliah();

  // --- STATE MANAGEMENT ---
  const [form, setForm] = useState({ kodemk: '', nama: '', sks: '', semester: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // --- FORM HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const openAddModal = () => {
    setForm({ kodemk: '', nama: '', sks: '', semester: '' });
    setSelectedId(null);
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleEdit = (mk) => {
    setForm({ kodemk: mk.kodemk, nama: mk.nama, sks: mk.sks, semester: mk.semester });
    setSelectedId(mk.id);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.kodemk || !form.nama || !form.sks || !form.semester) {
      toastError("Semua field wajib diisi!");
      return;
    }

    const payload = {
      ...form,
      sks: parseInt(form.sks, 10),
      semester: parseInt(form.semester, 10)
    };

    if (isEdit) {
      confirmUpdate(() => {
        update({ id: selectedId, data: { id: selectedId, ...payload } });
        setIsModalOpen(false);
      });
    } else {
      const exists = matakuliah.find((m) => m.kodemk === form.kodemk);
      if (exists) {
        toastError("Kode MK sudah terdaftar!");
        return;
      }
      store(payload);
      setIsModalOpen(false);
    }
  };

  const handleDelete = (id) => {
    confirmDelete(() => {
      remove(id);
    });
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
          <h2 className="text-lg font-semibold text-gray-800">Daftar Mata Kuliah</h2>
          {user?.permission?.includes("matakuliah.create") && (
            <button 
              onClick={openAddModal} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              + Tambah Mata Kuliah
            </button>
          )}
        </div>

        {/* Table Mata Kuliah */}
        {user?.permission?.includes("matakuliah.read") ? (
          isMataKuliahLoading ? (
            <div className="py-6 text-center text-gray-500">Memuat data mata kuliah...</div>
          ) : (
            <MatakuliahTable 
              data={matakuliah} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          )
        ) : (
          <p className="text-center text-gray-500 py-6">Anda tidak memiliki hak akses untuk melihat data mata kuliah.</p>
        )}
      </div>

      {/* Modal Form */}
      <MatakuliahModal 
        isOpen={isModalOpen}
        isEdit={isEdit}
        form={form}
        onChange={handleChange}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Matakuliah;
