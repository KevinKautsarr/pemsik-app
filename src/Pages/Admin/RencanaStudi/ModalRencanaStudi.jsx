import React from "react";
import Modal from "@/Components/Organisms/Modal";
import Label from "@/Components/Atoms/Label";
import Input from "@/Components/Atoms/Input";

const ModalRencanaStudi = ({
  isOpen,
  onClose,
  onSubmit,
  onChange,
  form,
  dosen,
  mataKuliah,
  validation,
}) => {
  if (!isOpen) return null;

  const {
    mataKuliahTerpilih,
    sksDosen,
    errorDosenKonflik,
    errorDosenSks,
    isValid,
  } = validation || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Kelas Baru">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nama">Nama Kelas</Label>
          <Input
            type="text"
            name="nama"
            id="nama"
            value={form.nama}
            onChange={onChange}
            placeholder="Contoh: TI-A"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="mata_kuliah_id">Mata Kuliah</Label>
          <select
            name="mata_kuliah_id"
            id="mata_kuliah_id"
            value={form.mata_kuliah_id}
            onChange={onChange}
            required
            className="mt-1 border border-gray-300 rounded w-full px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">-- Pilih Mata Kuliah --</option>
            {mataKuliah.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nama} ({m.sks} SKS)
              </option>
            ))}
          </select>
          {mataKuliahTerpilih && (
            <p className="mt-1 text-xs text-gray-500">
              {mataKuliahTerpilih.nama} — {mataKuliahTerpilih.sks} SKS
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="dosen_id">Dosen Pengampu</Label>
          <select
            name="dosen_id"
            id="dosen_id"
            value={form.dosen_id}
            onChange={onChange}
            required
            className="mt-1 border border-gray-300 rounded w-full px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">-- Pilih Dosen --</option>
            {dosen.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nama} {d.max_sks ? `(max ${d.max_sks} SKS)` : ""}
              </option>
            ))}
          </select>

          {form.dosen_id && sksDosen && sksDosen.max > 0 && (
            <p className="mt-1 text-xs text-gray-500">
              SKS Dosen: terpakai {sksDosen.terpakai}
              {sksDosen.sks > 0 ? ` + ${sksDosen.sks} (matkul ini)` : ""} ={" "}
              {sksDosen.total} / max {sksDosen.max}
            </p>
          )}
        </div>

        {errorDosenKonflik && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {errorDosenKonflik}
          </p>
        )}

        {errorDosenSks && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {errorDosenSks}
          </p>
        )}

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

export default ModalRencanaStudi;