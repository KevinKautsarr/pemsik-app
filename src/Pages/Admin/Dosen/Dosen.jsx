import React, { useState } from 'react';
import DosenTable from './DosenTable';
import DosenModal from './DosenModal';
import { confirmDelete, confirmUpdate } from '../../../Utils/Helpers/SwalHelpers';
import { toastError } from '../../../Utils/Helpers/ToastHelpers';
import { useAuthStateContext } from '../../../Utils/Contexts/AuthContext';
import {
  useDosen,
  useStoreDosen,
  useUpdateDosen,
  useDeleteDosen
} from '../../../Utils/Hooks/useDosen';

const Dosen = () => {
  const { user } = useAuthStateContext();

  // --- REACT QUERY DATA FETCHING ---
  const { data: dosen = [], isLoading: isDosenLoading } = useDosen();

  // --- REACT QUERY MUTATIONS ---
  const { mutate: store } = useStoreDosen();
  const { mutate: update } = useUpdateDosen();
  const { mutate: remove } = useDeleteDosen();

  // --- STATE MANAGEMENT ---
  const [form, setForm] = useState({ nidn: '', nama: '', email: '', bidang: '' });
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
    setForm({ nidn: '', nama: '', email: '', bidang: '' });
    setSelectedId(null);
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleEdit = (dsn) => {
    setForm({ nidn: dsn.nidn, nama: dsn.nama, email: dsn.email, bidang: dsn.bidang });
    setSelectedId(dsn.id);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nidn || !form.nama || !form.email || !form.bidang) {
      toastError("Semua field wajib diisi!");
      return;
    }
    if (isEdit) {
      confirmUpdate(() => {
        update({ id: selectedId, data: { id: selectedId, ...form } });
        setIsModalOpen(false);
      });
    } else {
      const exists = dosen.find((d) => d.nidn === form.nidn);
      if (exists) {
        toastError("NIDN sudah terdaftar!");
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
          <h2 className="text-lg font-semibold text-gray-800">Daftar Dosen</h2>
          {user?.permission?.includes("dosen.create") && (
            <button 
              onClick={openAddModal} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              + Tambah Dosen
            </button>
          )}
        </div>

        {/* Table Dosen */}
        {user?.permission?.includes("dosen.read") ? (
          isDosenLoading ? (
            <div className="py-6 text-center text-gray-500">Memuat data dosen...</div>
          ) : (
            <DosenTable 
              data={dosen} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          )
        ) : (
          <p className="text-center text-gray-500 py-6">Anda tidak memiliki hak akses untuk melihat data dosen.</p>
        )}
      </div>

      {/* Modal Form */}
      <DosenModal 
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

export default Dosen;
