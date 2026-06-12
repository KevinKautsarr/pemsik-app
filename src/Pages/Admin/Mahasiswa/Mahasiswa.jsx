import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MahasiswaTable from './MahasiswaTable';
import MahasiswaModal from './MahasiswaModal';
import { confirmDelete, confirmUpdate } from '../../../Utils/Helpers/SwalHelpers';
import { toastError } from '../../../Utils/Helpers/ToastHelpers';
import { useAuthStateContext } from '../../../Utils/Contexts/AuthContext';
import {
  useMahasiswa,
  useStoreMahasiswa,
  useUpdateMahasiswa,
  useDeleteMahasiswa
} from '../../../Utils/Hooks/useMahasiswa';
import { useKelas } from '../../../Utils/Hooks/useKelas';
import { useMataKuliah } from '../../../Utils/Hooks/useMataKuliah';

const Mahasiswa = () => {
  const navigate = useNavigate();
  const { user } = useAuthStateContext();

  // --- PAGINATION, FILTER & SORT STATE ---
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("nama");
  const [sortOrder, setSortOrder] = useState("asc");

  // --- REACT QUERY DATA FETCHING ---
  const { data: result = { data: [], total: 0 }, isLoading: isMahasiswaLoading } = useMahasiswa({
    q: search,
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: limit,
  });

  const { data: kelasRes = { data: [] } } = useKelas();
  const { data: mataKuliahRes = { data: [] } } = useMataKuliah();

  const mahasiswa = result.data;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  // --- REACT QUERY MUTATIONS ---
  const { mutate: store } = useStoreMahasiswa();
  const { mutate: update } = useUpdateMahasiswa();
  const { mutate: remove } = useDeleteMahasiswa();

  // --- LOCAL FORM STATE ---
  const [form, setForm] = useState({ nim: '', nama: '', name: '', max_sks: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // --- FORM HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "nama" || name === "name") {
      setForm({
        ...form,
        nama: value,
        name: value
      });
    } else if (name === "max_sks") {
      setForm({
        ...form,
        max_sks: parseInt(value, 10) || 0
      });
    } else {
      setForm({
        ...form,
        [name]: value
      });
    }
  };

  const openAddModal = () => {
    setForm({ nim: '', nama: '', name: '', max_sks: 0 });
    setSelectedId(null);
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleEdit = (mhs) => {
    setForm({ 
      nim: mhs.nim, 
      nama: mhs.nama || mhs.name || '', 
      name: mhs.name || mhs.nama || '', 
      max_sks: mhs.max_sks || 0 
    });
    setSelectedId(mhs.id);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nim || !(form.nama || form.name) || form.max_sks === undefined || form.max_sks === '') {
      toastError("NIM, Nama dan Max SKS wajib diisi!");
      return;
    }
    if (isEdit) {
      confirmUpdate(() => {
        const existingMhs = mahasiswa.find(m => m.id === selectedId) || {};
        const payload = {
          ...existingMhs,
          nim: form.nim,
          nama: form.nama || form.name,
          name: form.name || form.nama,
          max_sks: parseInt(form.max_sks, 10)
        };
        update({ id: selectedId, data: payload });
        setIsModalOpen(false);
      });
    } else {
      const payload = {
        nim: form.nim,
        nama: form.nama || form.name,
        name: form.name || form.nama,
        max_sks: parseInt(form.max_sks, 10),
        status: true,
        ips: 0
      };
      store(payload);
      setIsModalOpen(false);
    }
  };

  const getTotalSks = (mhsId) => {
    const kelasList = kelasRes?.data || [];
    const mataKuliahList = mataKuliahRes?.data || [];
    return kelasList
      .filter((k) => k.mahasiswa_ids?.includes(mhsId))
      .map((k) => mataKuliahList.find((mk) => mk.id === k.mata_kuliah_id)?.sks || 0)
      .reduce((a, b) => a + b, 0);
  };

  const handleDelete = (id) => {
    confirmDelete(() => {
      remove(id);
    });
  };

  // --- PAGINATION HANDLERS ---
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <>
      <div className="bg-white shadow rounded-lg p-4 space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
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

        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Search Input */}
            <input 
              type="text"
              placeholder="Cari nama atau NIM..."
              className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-64"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            {/* Sort Dropdowns */}
            <select 
              value={sortBy} 
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none"
            >
              <option value="nama">Urutkan: Nama</option>
              <option value="nim">Urutkan: NIM</option>
            </select>

            <select 
              value={sortOrder} 
              onChange={(e) => {
                setSortOrder(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none"
            >
              <option value="asc">Ascending (A-Z)</option>
              <option value="desc">Descending (Z-A)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Tampilkan:</span>
            <select 
              value={limit} 
              onChange={(e) => {
                setLimit(parseInt(e.target.value, 10));
                setPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus:outline-none"
            >
              <option value={2}>2 data</option>
              <option value={5}>5 data</option>
              <option value={10}>10 data</option>
            </select>
          </div>
        </div>

        {/* Table Mahasiswa */}
        {user?.permission?.includes("mahasiswa.read") ? (
          <>
            <MahasiswaTable 
              data={mahasiswa} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
              onDetail={(id) => navigate(`/admin/mahasiswa/${id}`)}
              isLoading={isMahasiswaLoading}
              getTotalSks={getTotalSks}
            />

            {/* Pagination Controls */}
            <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-2">
              <p className="text-sm text-gray-600">
                Menampilkan halaman <span className="font-semibold text-gray-800">{page}</span> dari <span className="font-semibold text-gray-800">{totalPages}</span> (Total: {totalCount} data)
              </p>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-gray-200 text-gray-700 font-medium text-sm rounded disabled:opacity-50 hover:bg-gray-300 transition"
                  onClick={handlePrev}
                  disabled={page === 1 || isMahasiswaLoading}
                >
                  Prev
                </button>
                <button
                  className="px-3 py-1 bg-gray-200 text-gray-700 font-medium text-sm rounded disabled:opacity-50 hover:bg-gray-300 transition"
                  onClick={handleNext}
                  disabled={page === totalPages || isMahasiswaLoading}
                >
                  Next
                </button>
              </div>
            </div>
          </>
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
