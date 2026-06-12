import { useMemo } from "react";
import {
  getTotalSksDosen,
  getTotalSksMahasiswa,
  getDosenExistingMataKuliah,
  isSameId,
} from "@/Utils/Helpers/SksHelpers";

/**
 * Hook validasi kelas — menghitung status validasi berdasarkan pilihan form
 * @param {object} form - { nama, mata_kuliah_id, dosen_id, mahasiswa_ids }
 * @param {Array} kelasList
 * @param {Array} dosenList
 * @param {Array} mahasiswaList
 * @param {Array} mataKuliahList
 * @param {string|number|null} editKelasId - ID kelas yang sedang diedit (untuk exclude)
 */
const useKelasValidation = (
  form,
  kelasList,
  dosenList,
  mahasiswaList,
  mataKuliahList,
  editKelasId = null
) => {
  const mataKuliahTerpilih = useMemo(
    () =>
      mataKuliahList.find((m) => isSameId(m.id, form.mata_kuliah_id)) || null,
    [form.mata_kuliah_id, mataKuliahList]
  );

  const dosenTerpilih = useMemo(
    () => dosenList.find((d) => isSameId(d.id, form.dosen_id)) || null,
    [form.dosen_id, dosenList]
  );

  // Cek konflik: matkul sudah punya dosen lain (di kelas lain)
  const konflikDosen = useMemo(() => {
    if (!form.mata_kuliah_id) return null;
    return getDosenExistingMataKuliah(
      form.mata_kuliah_id,
      kelasList,
      dosenList,
      editKelasId
    );
  }, [form.mata_kuliah_id, kelasList, dosenList, editKelasId]);

  // Apakah dosen yang dipilih saat ini berbeda dengan dosen yang sudah mengampu matkul ini
  const errorDosenKonflik = useMemo(() => {
    if (!konflikDosen || !form.dosen_id) return null;
    if (isSameId(konflikDosen.dosenId, form.dosen_id)) return null;
    return `Mata kuliah ini sudah diampu oleh ${konflikDosen.namaDosen}, tidak bisa ditugaskan ke dosen lain.`;
  }, [konflikDosen, form.dosen_id]);

  // Hitung SKS dosen saat ini + SKS matkul yang dipilih
  const sksDosen = useMemo(() => {
    if (!form.dosen_id) return { terpakai: 0, max: 0, sks: 0, total: 0 };

    const max = dosenTerpilih?.max_sks || 0;
    const sks = mataKuliahTerpilih?.sks || 0;
    const terpakai = getTotalSksDosen(
      form.dosen_id,
      kelasList,
      mataKuliahList,
      editKelasId
    );

    return { terpakai, max, sks, total: terpakai + sks };
  }, [
    form.dosen_id,
    form.mata_kuliah_id,
    kelasList,
    mataKuliahList,
    dosenTerpilih,
    mataKuliahTerpilih,
    editKelasId,
  ]);

  // Error SKS dosen hanya relevan kalau tidak ada konflik dosen-matkul
  // (kalau dosen yang dipilih memang tidak valid untuk matkul ini, jangan
  // tumpang tindih dengan pesan SKS yang membingungkan)
  const errorDosenSks = useMemo(() => {
    if (errorDosenKonflik) return null;
    if (!form.dosen_id || sksDosen.max <= 0) return null;
    if (sksDosen.total > sksDosen.max) {
      return `SKS dosen melebihi batas (${sksDosen.total}/${sksDosen.max} SKS)`;
    }
    return null;
  }, [errorDosenKonflik, form.dosen_id, sksDosen]);

  // Info SKS per mahasiswa (untuk multi-select)
  const mahasiswaSksInfo = useMemo(() => {
    const sksMatkul = mataKuliahTerpilih?.sks || 0;

    return mahasiswaList.map((m) => {
      const terpakai = getTotalSksMahasiswa(
        m.id,
        kelasList,
        mataKuliahList,
        editKelasId
      );
      const max = m.max_sks || 0;
      const sudahTerpilih = form.mahasiswa_ids?.some((id) =>
        isSameId(id, m.id)
      );

      // Kalau mahasiswa sudah terpilih di kelas ini, menghapusnya tidak
      // pernah melebihi batas — hanya relevan saat MENAMBAHKAN.
      const totalJikaDitambah = terpakai + sksMatkul;
      const akanMelebihi = !sudahTerpilih && totalJikaDitambah > max && max > 0;

      return {
        ...m,
        sksTerpakai: terpakai,
        sksMax: max,
        akanMelebihi,
        tooltip: akanMelebihi
          ? `SKS sudah penuh (${totalJikaDitambah}/${max})`
          : `${terpakai}/${max} SKS`,
      };
    });
  }, [
    mahasiswaList,
    kelasList,
    mataKuliahList,
    mataKuliahTerpilih,
    editKelasId,
    form.mahasiswa_ids,
  ]);

  const isValid =
    !!form.nama &&
    !!form.mata_kuliah_id &&
    !!form.dosen_id &&
    !errorDosenKonflik &&
    !errorDosenSks;

  return {
    mataKuliahTerpilih,
    dosenTerpilih,
    konflikDosen,
    sksDosen,
    errorDosenKonflik,
    errorDosenSks,
    mahasiswaSksInfo,
    isValid,
  };
};

export default useKelasValidation;