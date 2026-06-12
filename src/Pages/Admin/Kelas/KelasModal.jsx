import React from "react";
import Modal from "../../../Components/Organisms/Modal";
import Label from "../../../Components/Atoms/Label";
import Input from "../../../Components/Atoms/Input";

const KelasModal = ({
  isOpen,
  isEdit,
  form,
  onChange,
  onClose,
  onSubmit,
  // data referensi
  dosenList = [],
  mataKuliahList = [],
  mahasiswaList = [],
  // hasil validasi dari useKelasValidation
  validation = {},
}) => {
  if (!isOpen) return null;

  const {
    mataKuliahTerpilih,
    dosenTerpilih,
    konflikDosen,
    sksDosen,
    errorDosenKonflik,
    errorDosenSks,
    mahasiswaSksInfo = [],
    isValid,
  } = validation;

  // Toggle mahasiswa dari multi-select
  const toggleMahasiswa = (mhsId) => {
    const current = form.mahasiswa_ids || [];
    const updated = current.includes(mhsId)
      ? current.filter((id) => id !== mhsId)
      : [...current, mhsId];
    onChange({ target: { name: "mahasiswa_ids", value: updated } });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Kelas" : "Tambah Kelas"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Nama Kelas */}
        <div>
          <Label htmlFor="nama">Nama Kelas</Label>
          <Input
            name="nama"
            value={form.nama || ""}
            onChange={onChange}
            placeholder="Contoh: TI-A"
            required
            className="mt-1"
          />
        </div>

        {/* Mata Kuliah */}
        <div>
          <Label htmlFor="mata_kuliah_id">Mata Kuliah</Label>
          <select
            name="mata_kuliah_id"
            value={form.mata_kuliah_id || ""}
            onChange={onChange}
            required
            className="mt-1 border border-gray-300 rounded w-full px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">-- Pilih Mata Kuliah --</option>
            {mataKuliahList.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nama || m.name} ({m.sks} SKS)
              </option>
            ))}
          </select>

          {/* Ringkasan matkul */}
          {mataKuliahTerpilih && (
            <div className="mt-1 p-2 bg-blue-50 border border-blue-100 rounded text-xs text-blue-700">
              <span className="font-semibold">{mataKuliahTerpilih.nama}</span> — {mataKuliahTerpilih.sks} SKS
              {konflikDosen && (
                <span className="ml-2 text-orange-600 font-semibold">
                  · Dosen pengampu saat ini: {konflikDosen.namaDosen}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Dosen */}
        <div>
          <Label htmlFor="dosen_id">Dosen Pengampu</Label>
          <select
            name="dosen_id"
            value={form.dosen_id || ""}
            onChange={onChange}
            required
            className={`mt-1 border rounded w-full px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 ${
              errorDosenKonflik || errorDosenSks
                ? "border-red-400 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          >
            <option value="">-- Pilih Dosen --</option>
            {dosenList.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nama || d.name} (max {d.max_sks} SKS)
              </option>
            ))}
          </select>

          {/* Info SKS dosen */}
          {dosenTerpilih && (
            <div className={`mt-1 p-2 rounded text-xs border ${
              errorDosenSks
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-gray-50 border-gray-100 text-gray-600"
            }`}>
              SKS Dosen: terpakai <strong>{sksDosen.terpakai}</strong>
              {form.mata_kuliah_id && <> + {sksDosen.sks} (matkul ini) = <strong>{sksDosen.total}</strong></>}
              {" "}/ max <strong>{sksDosen.max}</strong>
            </div>
          )}

          {/* Error konflik dosen */}
          {errorDosenKonflik && (
            <p className="mt-1 text-xs text-red-600">⚠ {errorDosenKonflik}</p>
          )}
          {errorDosenSks && !errorDosenKonflik && (
            <p className="mt-1 text-xs text-red-600">⚠ {errorDosenSks}</p>
          )}
        </div>

        {/* Multi-select Mahasiswa */}
        <div>
          <Label>Mahasiswa</Label>
          <div className="mt-1 border border-gray-300 rounded overflow-hidden">
            <div className="bg-gray-50 px-3 py-1.5 text-xs text-gray-500 border-b border-gray-200">
              {(form.mahasiswa_ids || []).length} mahasiswa dipilih
              {mataKuliahTerpilih && ` · Menambahkan ${mataKuliahTerpilih.sks} SKS`}
            </div>
            <div className="max-h-52 overflow-y-auto divide-y divide-gray-100">
              {mahasiswaSksInfo.length === 0 ? (
                <p className="text-center text-gray-400 text-xs py-4">Tidak ada data mahasiswa</p>
              ) : (
                mahasiswaSksInfo.map((m) => {
                  const isChecked = (form.mahasiswa_ids || []).includes(m.id);
                  const isDisabled = m.akanMelebihi && !isChecked;
                  return (
                    <div
                      key={m.id}
                      title={m.tooltip}
                      className={`flex items-center gap-3 px-3 py-2 text-sm ${
                        isDisabled
                          ? "bg-red-50 opacity-60 cursor-not-allowed"
                          : "hover:bg-blue-50 cursor-pointer"
                      }`}
                      onClick={() => !isDisabled && toggleMahasiswa(m.id)}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        disabled={isDisabled}
                        className="accent-blue-600"
                      />
                      <div className="flex-1">
                        <span className="font-medium text-gray-800">
                          {m.nama || m.name}
                        </span>
                        <span className="text-gray-400 ml-1 text-xs">({m.nim})</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        m.akanMelebihi
                          ? "bg-red-100 text-red-600"
                          : m.sksTerpakai >= m.sksMax * 0.8
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {m.sksTerpakai}/{m.sksMax} SKS
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition font-medium"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Simpan
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default KelasModal;
