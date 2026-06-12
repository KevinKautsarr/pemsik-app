import React, { useState } from 'react';
import KelasTable from './KelasTable';
import KelasModal from './KelasModal';
import { confirmDelete, confirmUpdate } from '../../../Utils/Helpers/SwalHelpers';
import { toastError } from '../../../Utils/Helpers/ToastHelpers';
import { useAuthStateContext } from '../../../Utils/Contexts/AuthContext';
import {
  useKelas,
  useStoreKelas,
  useUpdateKelas,
  useDeleteKelas
} from '../../../Utils/Hooks/useKelas';

const Kelas = () => {
  const { user } = useAuthStateContext();

  // --- REACT QUERY DATA FETCHING ---
  const { data: kelas = [], isLoading: isKelasLoading } = useKelas();

  // --- REACT QUERY MUTATIONS ---
  const { mutate: store } = useStoreKelas();
  const { mutate: update } = useUpdateKelas();
  const { mutate: remove } = useDeleteKelas();

  // --- STATE MANAGEMENT ---
  const [form, setForm] = useState({ nama: '' });
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
    setForm({ nama: '' });
    setSelectedId(null);
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleEdit = (kls) => {
    setForm({ nama: kls.nama });
    setSelectedId(kls.id);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nama) {
      toastError("Nama kelas wajib diisi!");
      return;
    }
    if (isEdit) {
      confirmUpdate(() => {
        update({ id: selectedId, data: { id: selectedId, ...form } });
        setIsModalOpen(false);
      });
    } else {
      const exists = kelas.find((k) => k.nama.toLowerCase() === form.nama.toLowerCase());
      if (exists) {
        toastError("Nama kelas sudah terdaftar!");
        return;
      }
      store(form);
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
          <h2 className="text-lg font-semibold text-gray-800">Daftar Kelas</h2>
          {user?.permission?.includes("kelas.create") && (
            <button 
              onClick={openAddModal} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              + Tambah Kelas
            </button>
          )}
        </div>

        {/* Table Kelas */}
        {user?.permission?.includes("kelas.read") ? (
          isKelasLoading ? (
            <div className="py-6 text-center text-gray-500">Memuat data kelas...</div>
          ) : (
            <KelasTable 
              data={kelas} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          )
        ) : (
          <p className="text-center text-gray-500 py-6">Anda tidak memiliki hak akses untuk melihat data kelas.</p>
        )}
      </div>

      {/* Modal Form */}
      <KelasModal 
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

export default Kelas;
