import React, { useState, useEffect } from "react";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import { confirmDelete } from "@/Utils/Helpers/SwalHelpers";
import {
  getAllKelas,
  updateKelas,
  deleteKelas,
  storeKelas,
} from "@/Utils/Apis/KelasApi";
import { getAllDosen } from "@/Utils/Apis/DosenApi";
import { getAllMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { getAllMataKuliah } from "@/Utils/Apis/MatakuliahApi";
import {
  getTotalSksDosen,
  getTotalSksMahasiswa,
  isSameId,
} from "@/Utils/Helpers/SksHelpers";
import useKelasValidation from "@/Utils/Hooks/useKelasValidation";
import TableRencanaStudi from "./TableRencanaStudi";
import ModalRencanaStudi from "./ModalRencanaStudi";

const RencanaStudi = () => {
  const { user } = useAuthStateContext();
  const [kelas, setKelas] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);

  const [selectedMhs, setSelectedMhs] = useState({});
  const [selectedDsn, setSelectedDsn] = useState({});

  const [form, setForm] = useState({
    nama: "",
    mata_kuliah_id: "",
    dosen_id: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [resKelas, resDosen, resMahasiswa, resMataKuliah] =
      await Promise.all([
        getAllKelas(),
        getAllDosen(),
        getAllMahasiswa(),
        getAllMataKuliah(),
      ]);
    setKelas(resKelas.data);
    setDosen(resDosen.data);
    setMahasiswa(resMahasiswa.data);
    setMataKuliah(resMataKuliah.data);
  };

  // Mata kuliah yang belum punya kelas sama sekali (1 matkul = 1 kelas = 1 dosen)
  const mataKuliahBelumAdaKelas = mataKuliah.filter(
    (m) => !kelas.some((k) => isSameId(k.mata_kuliah_id, m.id))
  );

  const getMaxSksMahasiswa = (id) =>
    mahasiswa.find((m) => isSameId(m.id, id))?.max_sks || 0;

  const getMaxSksDosen = (id) =>
    dosen.find((d) => isSameId(d.id, id))?.max_sks || 0;

  // Validasi real-time untuk modal create kelas
  const validation = useKelasValidation(
    form,
    kelas,
    dosen,
    mahasiswa,
    mataKuliah,
    null
  );

  // ── Tambah Mahasiswa ke Kelas ──────────────────────────────────────────
  const handleAddMahasiswa = async (kelasItem, mhsId) => {
    if (!mhsId) {
      toastError("Pilih mahasiswa terlebih dahulu");
      return;
    }

    // 1) Cek duplikasi dulu
    if (kelasItem.mahasiswa_ids?.some((id) => isSameId(id, mhsId))) {
      toastError("Mahasiswa sudah terdaftar di kelas ini");
      return;
    }

    // 2) Baru cek SKS
    const matkul = mataKuliah.find((m) =>
      isSameId(m.id, kelasItem.mata_kuliah_id)
    );
    const sks = matkul?.sks || 0;

    const totalSksMahasiswa = getTotalSksMahasiswa(mhsId, kelas, mataKuliah);
    const maxSks = getMaxSksMahasiswa(mhsId);

    if (maxSks > 0 && totalSksMahasiswa + sks > maxSks) {
      toastError(
        `SKS mahasiswa melebihi batas maksimal (${totalSksMahasiswa + sks}/${maxSks})`
      );
      return;
    }

    const updated = {
      ...kelasItem,
      mahasiswa_ids: [...(kelasItem.mahasiswa_ids ?? []), mhsId],
    };

    await updateKelas(kelasItem.id, updated);
    toastSuccess("Mahasiswa ditambahkan");
    setSelectedMhs((prev) => ({ ...prev, [kelasItem.id]: "" }));
    fetchData();
  };

  // ── Hapus Mahasiswa dari Kelas ──────────────────────────────────────────
  const handleDeleteMahasiswa = async (kelasItem, mhsId) => {
    const updated = {
      ...kelasItem,
      mahasiswa_ids: (kelasItem.mahasiswa_ids ?? []).filter(
        (id) => !isSameId(id, mhsId)
      ),
    };
    await updateKelas(kelasItem.id, updated);
    toastSuccess("Mahasiswa dihapus");
    fetchData();
  };

  // ── Ganti Dosen Pengampu Kelas ───────────────────────────────────────────
  const handleChangeDosen = async (kelasItem) => {
    const dsnId = selectedDsn[kelasItem.id];
    if (!dsnId) return;

    // Tidak ada perubahan
    if (isSameId(dsnId, kelasItem.dosen_id)) {
      toastError("Dosen yang dipilih sama dengan dosen saat ini");
      return;
    }

    const kelasSks =
      mataKuliah.find((m) => isSameId(m.id, kelasItem.mata_kuliah_id))?.sks ||
      0;
    const maxSks = getMaxSksDosen(dsnId);

    // Exclude kelas ini sendiri dari hitungan SKS dosen baru
    const totalSksDosenBaru = getTotalSksDosen(
      dsnId,
      kelas,
      mataKuliah,
      kelasItem.id
    );

    if (maxSks > 0 && totalSksDosenBaru + kelasSks > maxSks) {
      toastError(
        `Dosen melebihi batas maksimal SKS (${totalSksDosenBaru + kelasSks}/${maxSks})`
      );
      return;
    }

    await updateKelas(kelasItem.id, { ...kelasItem, dosen_id: dsnId });
    toastSuccess("Dosen diperbarui");
    setSelectedDsn((prev) => ({ ...prev, [kelasItem.id]: "" }));
    fetchData();
  };

  // ── Hapus Kelas ──────────────────────────────────────────────────────────
  const handleDeleteKelas = async (kelasId) => {
    confirmDelete(async () => {
      await deleteKelas(kelasId);
      toastSuccess("Kelas dihapus");
      fetchData();
    });
  };

  // ── Modal Create Kelas ───────────────────────────────────────────────────
  const openAddModal = () => {
    setForm({ nama: "", mata_kuliah_id: "", dosen_id: "" });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      // Reset dosen jika mata kuliah berubah, supaya validasi tidak
      // membandingkan dosen lama dengan matkul baru
      if (name === "mata_kuliah_id") {
        return { ...prev, mata_kuliah_id: value, dosen_id: "" };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.mata_kuliah_id || !form.dosen_id) {
      toastError("Form tidak lengkap");
      return;
    }

    if (validation.errorDosenKonflik) {
      toastError(validation.errorDosenKonflik);
      return;
    }

    if (validation.errorDosenSks) {
      toastError(validation.errorDosenSks);
      return;
    }

    await storeKelas({
      nama: form.nama || undefined,
      mata_kuliah_id: form.mata_kuliah_id,
      dosen_id: form.dosen_id,
      mahasiswa_ids: [],
    });

    setIsModalOpen(false);
    toastSuccess("Kelas ditambahkan");
    fetchData();
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg p-4 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <h2 className="text-lg font-semibold text-gray-800">
            Rencana Studi
          </h2>
          {user?.permission?.includes("rencana-studi.create") && (
            <button
              onClick={openAddModal}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              + Tambah Kelas
            </button>
          )}
        </div>

        {/* Table / Content */}
        {user?.permission?.includes("rencana-studi.read") ? (
          <TableRencanaStudi
            kelas={kelas}
            mahasiswa={mahasiswa}
            dosen={dosen}
            mataKuliah={mataKuliah}
            selectedMhs={selectedMhs}
            setSelectedMhs={setSelectedMhs}
            selectedDsn={selectedDsn}
            setSelectedDsn={setSelectedDsn}
            handleAddMahasiswa={handleAddMahasiswa}
            handleDeleteMahasiswa={handleDeleteMahasiswa}
            handleChangeDosen={handleChangeDosen}
            handleDeleteKelas={handleDeleteKelas}
            canUpdate={user?.permission?.includes("rencana-studi.update")}
            canDelete={user?.permission?.includes("rencana-studi.delete")}
          />
        ) : (
          <p className="text-center text-gray-500 py-6">
            Anda tidak memiliki hak akses untuk melihat data rencana studi.
          </p>
        )}
      </div>

      <ModalRencanaStudi
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onChange={handleChange}
        onSubmit={handleSubmit}
        form={form}
        dosen={dosen}
        mataKuliah={mataKuliahBelumAdaKelas}
        validation={validation}
      />
    </>
  );
};

export default RencanaStudi;