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

  // --- PAGINATION, FILTER & SORT STATE ---
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("nama");
  const [sortOrder, setSortOrder] = useState("asc");

  // --- REACT QUERY DATA FETCHING ---
  const { data: result = { data: [], total: 0 }, isLoading: isDosenLoading } = useDosen({
    q: search,
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: limit,
  });

  const dosen = result.data;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit) || 1;

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
      store(form);
      setIsModalOpen(false);
    }
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

        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <input 
              type="text"
              placeholder="Cari nama, NIDN, atau email..."
              className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-64"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            <select 
              value={sortBy} 
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none"
            >
              <option value="nama">Urutkan: Nama</option>
              <option value="nidn">Urutkan: NIDN</option>
              <option value="bidang">Urutkan: Bidang</option>
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

        {/* Table Dosen */}
        {user?.permission?.includes("dosen.read") ? (
          <>
            <DosenTable 
              data={dosen} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
              isLoading={isDosenLoading}
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
                  disabled={page === 1 || isDosenLoading}
                >
                  Prev
                </button>
                <button
                  className="px-3 py-1 bg-gray-200 text-gray-700 font-medium text-sm rounded disabled:opacity-50 hover:bg-gray-300 transition"
                  onClick={handleNext}
                  disabled={page === totalPages || isDosenLoading}
                >
                  Next
                </button>
              </div>
            </div>
          </>
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
