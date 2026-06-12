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
  useDeleteKelas,
} from '../../../Utils/Hooks/useKelas';
import { useDosen } from '../../../Utils/Hooks/useDosen';
import { useMahasiswa } from '../../../Utils/Hooks/useMahasiswa';
import { useMataKuliah } from '../../../Utils/Hooks/useMataKuliah';
import useKelasValidation from '../../../Utils/Hooks/useKelasValidation';

const EMPTY_FORM = { nama: '', mata_kuliah_id: '', dosen_id: '', mahasiswa_ids: [] };

const Kelas = () => {
  const { user } = useAuthStateContext();

  // --- PAGINATION, FILTER & SORT STATE ---
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('nama');
  const [sortOrder, setSortOrder] = useState('asc');

  // --- FETCH DATA ---
  const { data: result = { data: [], total: 0 }, isLoading: isKelasLoading } = useKelas({
    q: search,
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: limit,
  });
  // Fetch all kelas (no pagination) for validation
  const { data: allKelasRes = { data: [] } } = useKelas();
  const { data: dosenRes = { data: [] } } = useDosen();
  const { data: mahasiswaRes = { data: [] } } = useMahasiswa();
  const { data: mataKuliahRes = { data: [] } } = useMataKuliah();

  const kelasList = result.data;
  const allKelas = allKelasRes.data;
  const dosenList = dosenRes.data;
  const mahasiswaList = mahasiswaRes.data;
  const mataKuliahList = mataKuliahRes.data;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  // --- MUTATIONS ---
  const { mutate: store } = useStoreKelas();
  const { mutate: update } = useUpdateKelas();
  const { mutate: remove } = useDeleteKelas();

  // --- FORM STATE ---
  const [form, setForm] = useState(EMPTY_FORM);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // --- VALIDATION HOOK ---
  const validation = useKelasValidation(
    form,
    allKelas,
    dosenList,
    mahasiswaList,
    mataKuliahList,
    isEdit ? selectedId : null
  );

  // --- FORM HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      // Reset dosen jika matkul berubah
      ...(name === 'mata_kuliah_id' ? { dosen_id: '' } : {}),
    }));
  };

  const openAddModal = () => {
    setForm(EMPTY_FORM);
    setSelectedId(null);
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleEdit = (kls) => {
    setForm({
      nama: kls.nama || '',
      mata_kuliah_id: kls.mata_kuliah_id || '',
      dosen_id: kls.dosen_id || '',
      mahasiswa_ids: kls.mahasiswa_ids || [],
    });
    setSelectedId(kls.id);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validation.isValid) {
      toastError('Periksa kembali form, ada validasi yang belum terpenuhi.');
      return;
    }
    const payload = {
      nama: form.nama,
      mata_kuliah_id: form.mata_kuliah_id,
      dosen_id: form.dosen_id,
      mahasiswa_ids: form.mahasiswa_ids || [],
    };
    if (isEdit) {
      confirmUpdate(() => {
        update({ id: selectedId, data: { id: selectedId, ...payload } });
        setIsModalOpen(false);
      });
    } else {
      store(payload);
      setIsModalOpen(false);
    }
  };

  const handleDelete = (id) => {
    confirmDelete(() => {
      remove(id);
    });
  };

  // --- PAGINATION ---
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <>
      <div className="bg-white shadow rounded-lg p-4 space-y-4">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
          <h2 className="text-lg font-semibold text-gray-800">Daftar Kelas</h2>
          {user?.permission?.includes('kelas.create') && (
            <button
              onClick={openAddModal}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              + Tambah Kelas
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <input
              type="text"
              placeholder="Cari nama kelas..."
              className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-64"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none"
            >
              <option value="nama">Urutkan: Nama Kelas</option>
              <option value="id">Urutkan: ID</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Tampilkan:</span>
            <select
              value={limit}
              onChange={(e) => { setLimit(parseInt(e.target.value, 10)); setPage(1); }}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus:outline-none"
            >
              <option value={2}>2 data</option>
              <option value={5}>5 data</option>
              <option value={10}>10 data</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {user?.permission?.includes('kelas.read') ? (
          <>
            <KelasTable
              data={kelasList}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isKelasLoading}
              dosenList={dosenList}
              mataKuliahList={mataKuliahList}
            />
            <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-2">
              <p className="text-sm text-gray-600">
                Menampilkan halaman <span className="font-semibold text-gray-800">{page}</span> dari{' '}
                <span className="font-semibold text-gray-800">{totalPages}</span> (Total: {totalCount} data)
              </p>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-gray-200 text-gray-700 font-medium text-sm rounded disabled:opacity-50 hover:bg-gray-300 transition"
                  onClick={handlePrev}
                  disabled={page === 1 || isKelasLoading}
                >
                  Prev
                </button>
                <button
                  className="px-3 py-1 bg-gray-200 text-gray-700 font-medium text-sm rounded disabled:opacity-50 hover:bg-gray-300 transition"
                  onClick={handleNext}
                  disabled={page === totalPages || isKelasLoading}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 py-6">
            Anda tidak memiliki hak akses untuk melihat data kelas.
          </p>
        )}
      </div>

      <KelasModal
        isOpen={isModalOpen}
        isEdit={isEdit}
        form={form}
        onChange={handleChange}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        dosenList={dosenList}
        mataKuliahList={mataKuliahList}
        mahasiswaList={mahasiswaList}
        validation={validation}
      />
    </>
  );
};

export default Kelas;
