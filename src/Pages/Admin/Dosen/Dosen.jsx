import React, { useState, useEffect } from 'react';
import { getAllDosen, storeDosen, updateDosen, deleteDosen } from '../../../Utils/Apis/DosenApi';
import DosenTable from './DosenTable';
import DosenModal from './DosenModal';
import { confirmDelete, confirmUpdate } from '../../../Utils/Helpers/SwalHelpers';
import { toastSuccess, toastError } from '../../../Utils/Helpers/ToastHelpers';
import { useAuthStateContext } from '../../../Utils/Contexts/AuthContext';

const Dosen = () => {
  const { user } = useAuthStateContext();

  // --- STATE MANAGEMENT ---
  const [dosen, setDosen] = useState([]);
  const [form, setForm] = useState({ nidn: '', nama: '', email: '', bidang: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchDosen = async () => {
    try {
      const res = await getAllDosen();
      setDosen(res.data);
    } catch (err) {
      toastError("Gagal mengambil data dosen");
    }
  };

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    fetchDosen();
  }, []);

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

  // --- CRUD LOGIC ---
  const storeDosenData = async (newData) => {
    const exists = dosen.find((d) => d.nidn === newData.nidn);
    if (exists) {
      toastError("Gagal: NIDN sudah terdaftar!");
      return;
    }
    try {
      await storeDosen(newData);
      fetchDosen();
      toastSuccess("Dosen berhasil ditambah!");
      setIsModalOpen(false);
    } catch (err) {
      toastError("Gagal menambahkan data dosen");
    }
  };

  const updateDosenData = async (newData) => {
    confirmUpdate(async () => {
      try {
        await updateDosen(selectedId, { id: selectedId, ...newData });
        fetchDosen();
        toastSuccess("Dosen berhasil di-edit!");
        setIsModalOpen(false);
      } catch (err) {
        toastError("Gagal memperbarui data");
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nidn || !form.nama || !form.email || !form.bidang) {
      toastError("Semua field wajib diisi!");
      return;
    }
    if (isEdit) {
      updateDosenData(form);
    } else {
      storeDosenData(form);
    }
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        await deleteDosen(id);
        fetchDosen();
        toastSuccess("Dosen berhasil terhapus!");
      } catch (err) {
        toastError("Gagal menghapus data");
      }
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
          <DosenTable 
            data={dosen} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
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
