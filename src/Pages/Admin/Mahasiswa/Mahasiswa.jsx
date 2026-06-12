import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllMahasiswa, storeMahasiswa, updateMahasiswa, deleteMahasiswa } from '../../../Utils/Apis/MahasiswaApi';
import MahasiswaTable from './MahasiswaTable';
import MahasiswaModal from './MahasiswaModal';
import { confirmDelete, confirmUpdate } from '../../../Utils/Helpers/SwalHelpers';
import { toastSuccess, toastError } from '../../../Utils/Helpers/ToastHelpers';
import { useAuthStateContext } from '../../../Utils/Contexts/AuthContext';

const Mahasiswa = () => {
  const navigate = useNavigate();
  const { user } = useAuthStateContext();

  // --- STATE MANAGEMENT (LIFTED STATE) ---
  const [mahasiswa, setMahasiswa] = useState([]);
  const [form, setForm] = useState({ nim: '', nama: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchMahasiswa = async () => {
    try {
      const res = await getAllMahasiswa();
      setMahasiswa(res.data);
    } catch (err) {
      toastError("Gagal mengambil data mahasiswa");
    }
  };

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    fetchMahasiswa();
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
    setForm({ nim: '', nama: '' });
    setSelectedId(null);
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleEdit = (mhs) => {
    setForm({ nim: mhs.nim, nama: mhs.nama });
    setSelectedId(mhs.id);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  // --- CRUD LOGIC ---
  const storeMahasiswaData = async (newData) => {
    const exists = mahasiswa.find((m) => m.nim === newData.nim);
    if (exists) {
      toastError("Gagal: NIM sudah terdaftar!");
      return;
    }
    try {
      await storeMahasiswa(newData);
      fetchMahasiswa();
      toastSuccess("Mahasiswa berhasil ditambah!");
      setIsModalOpen(false);
    } catch (err) {
      toastError("Gagal menambahkan data mahasiswa");
    }
  };

  const updateMahasiswaData = async (newData) => {
    confirmUpdate(async () => {
      try {
        await updateMahasiswa(selectedId, { id: selectedId, ...newData });
        fetchMahasiswa();
        toastSuccess("Mahasiswa berhasil di-edit!");
        setIsModalOpen(false);
      } catch (err) {
        toastError("Gagal memperbarui data");
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nim || !form.nama) {
      toastError("NIM dan Nama wajib diisi!");
      return;
    }
    if (isEdit) {
      updateMahasiswaData(form);
    } else {
      storeMahasiswaData(form);
    }
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        await deleteMahasiswa(id);
        fetchMahasiswa();
        toastSuccess("Mahasiswa berhasil terhapus!");
      } catch (err) {
        toastError("Gagal menghapus data");
      }
    });
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
          <h2 className="text-lg font-semibold text-gray-800">Daftar Mahasiswa</h2>
          {user?.permission?.includes("mahasiswa.create") && (
            <button 
              onClick={openAddModal} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              + Tambah Mahasiswa
            </button>
          )}
        </div>

        {/* Table Mahasiswa */}
        {user?.permission?.includes("mahasiswa.read") ? (
          <MahasiswaTable 
            data={mahasiswa} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onDetail={(id) => navigate(`/admin/mahasiswa/${id}`)}
          />
        ) : (
          <p className="text-center text-gray-500 py-6">Anda tidak memiliki hak akses untuk melihat data mahasiswa.</p>
        )}
      </div>

      {/* Modal Form */}
      <MahasiswaModal 
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

export default Mahasiswa;
