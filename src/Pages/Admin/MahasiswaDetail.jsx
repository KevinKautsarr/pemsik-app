import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMahasiswa } from '../../Utils/Apis/MahasiswaApi';
import { getAllKelas } from '../../Utils/Apis/KelasApi';
import { getAllMataKuliah } from '../../Utils/Apis/MataKuliahApi';
import { toastError } from '../../Utils/Helpers/ToastHelpers';

const MahasiswaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mahasiswa, setMahasiswa] = useState(null);
  const [kelas, setKelas] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [resMhs, resKelas, resMataKuliah] = await Promise.all([
        getMahasiswa(id),
        getAllKelas(),
        getAllMataKuliah(),
      ]);
      setMahasiswa(resMhs.data);
      setKelas(resKelas.data);
      setMataKuliah(resMataKuliah.data);
    } catch (err) {
      toastError("Gagal mengambil data mahasiswa");
    } finally {
      setLoading(false);
    }
  };

  const getTotalSks = () => {
    return kelas
      .filter((k) => k.mahasiswa_ids?.includes(id) || k.mahasiswa_ids?.includes(String(id)))
      .map((k) => mataKuliah.find((m) => m.id === k.mata_kuliah_id)?.sks || 0)
      .reduce((a, b) => a + b, 0);
  };

  const getKelasDiikuti = () => {
    return kelas
      .filter((k) => k.mahasiswa_ids?.includes(id) || k.mahasiswa_ids?.includes(String(id)))
      .map((k) => ({
        ...k,
        namaMataKuliah: mataKuliah.find((m) => m.id === k.mata_kuliah_id)?.nama ||
                        mataKuliah.find((m) => m.id === k.mata_kuliah_id)?.name || '-',
        sks: mataKuliah.find((m) => m.id === k.mata_kuliah_id)?.sks || 0,
      }));
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-center items-center py-12 space-x-2">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-500 text-sm">Memuat data mahasiswa...</span>
        </div>
      </div>
    );
  }

  if (!mahasiswa) {
    return (
      <div className="bg-white shadow rounded-lg p-4 text-center py-12">
        <p className="text-gray-500 mb-4">Data mahasiswa tidak ditemukan.</p>
        <button
          onClick={() => navigate('/admin/mahasiswa')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Kembali ke Daftar Mahasiswa
        </button>
      </div>
    );
  }

  const totalSks = getTotalSks();
  const kelasDiikuti = getKelasDiikuti();
  const namaDisplay = mahasiswa.nama || mahasiswa.name || '-';
  const inisial = namaDisplay.charAt(0).toUpperCase();

  return (
    <div className="space-y-4">
      {/* Tombol Kembali */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition"
      >
        ← Kembali ke Daftar Mahasiswa
      </button>

      {/* Card Profil */}
      <div className="bg-white shadow rounded-lg p-4 space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <h2 className="text-lg font-semibold text-gray-800">Detail Mahasiswa</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center justify-start md:w-40 shrink-0">
            <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow">
              {inisial}
            </div>
            <p className="mt-3 text-sm font-semibold text-gray-800 text-center">{namaDisplay}</p>
            <p className="text-xs text-gray-400 text-center">{mahasiswa.nim}</p>
          </div>

          {/* Info */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <p className="text-xs text-gray-400 uppercase font-semibold mb-1">NIM</p>
              <p className="text-sm font-medium text-gray-800">{mahasiswa.nim}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Nama Lengkap</p>
              <p className="text-sm font-medium text-gray-800">{namaDisplay}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Status</p>
              <span className={`inline-block text-xs font-semibold px-2 py-1 rounded ${
                mahasiswa.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
              }`}>
                {mahasiswa.status ? 'Aktif' : 'Tidak Aktif'}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <p className="text-xs text-gray-400 uppercase font-semibold mb-1">IPS</p>
              <p className="text-sm font-medium text-gray-800">{mahasiswa.ips ?? '-'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Maksimal SKS</p>
              <p className="text-sm font-medium text-gray-800">{mahasiswa.max_sks ?? '-'} SKS</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <p className="text-xs text-gray-400 uppercase font-semibold mb-1">SKS Terpakai</p>
              <p className={`text-sm font-medium ${
                totalSks >= (mahasiswa.max_sks || 0) ? 'text-red-600' : 'text-green-600'
              }`}>
                {totalSks} / {mahasiswa.max_sks ?? '-'} SKS
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Kelas yang Diikuti */}
      <div className="bg-white shadow rounded-lg p-4 space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <h2 className="text-lg font-semibold text-gray-800">
            Mata Kuliah yang Diikuti
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({kelasDiikuti.length} mata kuliah)
            </span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-blue-600 text-white font-medium">
              <tr>
                <th className="py-2 px-4 text-left w-12">No</th>
                <th className="py-2 px-4 text-left">Nama Mata Kuliah</th>
                <th className="py-2 px-4 text-center">SKS</th>
              </tr>
            </thead>
            <tbody>
              {kelasDiikuti.length > 0 ? (
                kelasDiikuti.map((k, i) => (
                  <tr key={k.id} className="even:bg-gray-100 odd:bg-white border-b border-gray-100">
                    <td className="py-2 px-4 font-medium">{i + 1}</td>
                    <td className="py-2 px-4">{k.namaMataKuliah}</td>
                    <td className="py-2 px-4 text-center">{k.sks}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-gray-400">
                    Mahasiswa belum terdaftar di kelas manapun.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MahasiswaDetail;
