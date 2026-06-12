import React, { useState, useEffect } from 'react';
import { getAllMatakuliah, storeMatakuliah, updateMatakuliah, deleteMatakuliah } from '../../../Utils/Apis/MatakuliahApi';
import MatakuliahTable from './MatakuliahTable';
import MatakuliahModal from './MatakuliahModal';
import { confirmDelete, confirmUpdate } from '../../../Utils/Helpers/SwalHelpers';
import { toastSuccess, toastError } from '../../../Utils/Helpers/ToastHelpers';

const Matakuliah = () => {
  // --- STATE MANAGEMENT ---
  const [matakuliah, setMatakuliah] = useState([]);
  const [form, setForm] = useState({ kodemk: '', nama: '', sks: '', semester: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchMatakuliah = async () => {
    try {
      const res = await getAllMatakuliah();
      setMatakuliah(res.data);
    } catch (err) {
      toastError("Gagal mengambil data mata kuliah");
    }
  };

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    fetchMatakuliah();
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

  // --- CRUD LOGIC ---
  const storeMatakuliahData = async (newData) => {
    const exists = matakuliah.find((m) => m.kodemk === newData.kodemk);
    if (exists) {
      toastError("Gagal: Kode MK sudah terdaftar!");
      return;
    }
    try {
      // Convert numeric fields to integers
      const payload = {
        ...newData,
        sks: parseInt(newData.sks, 10),
        semester: parseInt(newData.semester, 10)
      };
      await storeMatakuliah(payload);
      fetchMatakuliah();
      toastSuccess("Mata kuliah berhasil ditambah!");
      setIsModalOpen(false);
    } catch (err) {
      toastError("Gagal menambahkan data mata kuliah");
    }
  };

  const updateMatakuliahData = async (newData) => {
    confirmUpdate(async () => {
      try {
        const payload = {
          id: selectedId,
          ...newData,
          sks: parseInt(newData.sks, 10),
          semester: parseInt(newData.semester, 10)
        };
        await updateMatakuliah(selectedId, payload);
        fetchMatakuliah();
        toastSuccess("Mata kuliah berhasil di-edit!");
        setIsModalOpen(false);
      } catch (err) {
        toastError("Gagal memperbarui data");
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.kodemk || !form.nama || !form.sks || !form.semester) {
      toastError("Semua field wajib diisi!");
      return;
    }
    if (isEdit) {
      updateMatakuliahData(form);
    } else {
      storeMatakuliahData(form);
    }
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        await deleteMatakuliah(id);
        fetchMatakuliah();
        toastSuccess("Mata kuliah berhasil terhapus!");
      } catch (err) {
        toastError("Gagal menghapus data");
      }
    });
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Daftar Mata Kuliah</h2>
          <button 
            onClick={openAddModal} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Tambah Mata Kuliah
          </button>
        </div>

        {/* Table Mata Kuliah */}
        <MatakuliahTable 
          data={matakuliah} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
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
