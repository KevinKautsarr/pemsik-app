/**
 * Helper untuk membandingkan ID secara aman terhadap perbedaan tipe (string vs number).
 * excludeId === null/undefined dianggap "tidak ada yang di-exclude".
 */
const isSameId = (a, b) => String(a) === String(b);
const isExcluded = (id, excludeId) =>
  excludeId != null && isSameId(id, excludeId);

/**
 * Hitung total SKS yang sudah diampu seorang dosen
 * @param {string|number} dosenId
 * @param {Array} kelasList - seluruh data kelas
 * @param {Array} mataKuliahList - seluruh data mata kuliah
 * @param {string|number|null} excludeKelasId - abaikan kelas tertentu (untuk mode edit)
 */
export const getTotalSksDosen = (
  dosenId,
  kelasList,
  mataKuliahList,
  excludeKelasId = null
) => {
  if (!dosenId) return 0;

  return kelasList
    .filter(
      (k) =>
        isSameId(k.dosen_id, dosenId) && !isExcluded(k.id, excludeKelasId)
    )
    .map(
      (k) =>
        mataKuliahList.find((m) => isSameId(m.id, k.mata_kuliah_id))?.sks || 0
    )
    .reduce((acc, curr) => acc + curr, 0);
};

/**
 * Hitung total SKS yang sudah diambil seorang mahasiswa
 * @param {string|number} mahasiswaId
 * @param {Array} kelasList - seluruh data kelas
 * @param {Array} mataKuliahList - seluruh data mata kuliah
 * @param {string|number|null} excludeKelasId - abaikan kelas tertentu (untuk mode edit)
 */
export const getTotalSksMahasiswa = (
  mahasiswaId,
  kelasList,
  mataKuliahList,
  excludeKelasId = null
) => {
  if (!mahasiswaId) return 0;

  return kelasList
    .filter(
      (k) =>
        k.mahasiswa_ids?.some((id) => isSameId(id, mahasiswaId)) &&
        !isExcluded(k.id, excludeKelasId)
    )
    .map(
      (k) =>
        mataKuliahList.find((m) => isSameId(m.id, k.mata_kuliah_id))?.sks || 0
    )
    .reduce((acc, curr) => acc + curr, 0);
};

/**
 * Cek apakah mata kuliah sudah punya dosen di kelas lain
 * @param {string|number} mataKuliahId
 * @param {Array} kelasList
 * @param {Array} dosenList
 * @param {string|number|null} excludeKelasId - abaikan kelas tertentu (untuk mode edit)
 * @returns {object|null} { dosenId, namaDosen } jika sudah ada, null jika belum
 */
export const getDosenExistingMataKuliah = (
  mataKuliahId,
  kelasList,
  dosenList,
  excludeKelasId = null
) => {
  if (!mataKuliahId) return null;

  const kelasAda = kelasList.find(
    (k) =>
      isSameId(k.mata_kuliah_id, mataKuliahId) &&
      !isExcluded(k.id, excludeKelasId)
  );
  if (!kelasAda) return null;

  const dosen = dosenList.find((d) => isSameId(d.id, kelasAda.dosen_id));
  return dosen ? { dosenId: dosen.id, namaDosen: dosen.nama } : null;
};

export { isSameId, isExcluded };