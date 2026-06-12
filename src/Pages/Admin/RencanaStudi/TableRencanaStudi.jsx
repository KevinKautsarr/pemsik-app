import React from "react";
import { isSameId, getTotalSksMahasiswa } from "@/Utils/Helpers/SksHelpers";

export default function TableRencanaStudi({
  kelas,
  mahasiswa,
  dosen,
  mataKuliah,
  selectedMhs,
  setSelectedMhs,
  selectedDsn,
  setSelectedDsn,
  handleAddMahasiswa,
  handleDeleteMahasiswa,
  handleChangeDosen,
  handleDeleteKelas,
  canUpdate,
  canDelete,
}) {
  if (kelas.length === 0) {
    return (
      <p className="text-center text-gray-400 py-6">Belum ada data kelas.</p>
    );
  }

  return (
    <div className="space-y-6">
      {kelas.map((kls) => {
        const matkul = mataKuliah.find((m) => isSameId(m.id, kls.mata_kuliah_id));
        const dosenPengampu = dosen.find((d) => isSameId(d.id, kls.dosen_id));
        const mhsInClass = (kls.mahasiswa_ids ?? [])
          .map((id) => mahasiswa.find((m) => isSameId(m.id, id)))
          .filter(Boolean);

        return (
          <div
            key={kls.id}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
          >
            {/* Card Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50 gap-3">
              <div>
                <p className="text-base font-semibold text-gray-800">
                  {matkul?.nama || "-"}
                  {matkul?.sks ? (
                    <span className="ml-2 text-xs font-normal text-gray-500">
                      ({matkul.sks} SKS)
                    </span>
                  ) : null}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Dosen Pengampu:{" "}
                  <span className="font-medium text-gray-700">
                    {dosenPengampu?.nama || "-"}
                  </span>
                </p>
              </div>

              {canUpdate && (
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={selectedDsn[kls.id] || ""}
                    onChange={(e) =>
                      setSelectedDsn({ ...selectedDsn, [kls.id]: e.target.value })
                    }
                    className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">-- Ganti Dosen --</option>
                    {dosen.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nama}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleChangeDosen(kls)}
                    disabled={!selectedDsn[kls.id]}
                    className="bg-yellow-500 text-white text-sm px-3 py-1.5 rounded hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Simpan
                  </button>
                  {canDelete && mhsInClass.length === 0 && (
                    <button
                      onClick={() => handleDeleteKelas(kls.id)}
                      className="bg-red-500 text-white text-sm px-3 py-1.5 rounded hover:bg-red-600 transition"
                    >
                      Hapus Kelas
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mahasiswa Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700">
                <thead className="bg-blue-600 text-white font-medium">
                  <tr>
                    <th className="py-2 px-4 text-left w-12">No</th>
                    <th className="py-2 px-4 text-left">Nama</th>
                    <th className="py-2 px-4 text-left">NIM</th>
                    <th className="py-2 px-4 text-center">Total SKS</th>
                    {canDelete && (
                      <th className="py-2 px-4 text-center">Aksi</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {mhsInClass.length > 0 ? (
                    mhsInClass.map((m, i) => {
                      const totalSks = getTotalSksMahasiswa(
                        m.id,
                        kelas,
                        mataKuliah
                      );
                      const maxSks = m.max_sks || 0;

                      return (
                        <tr
                          key={m.id}
                          className="even:bg-gray-100 odd:bg-white border-b border-gray-100"
                        >
                          <td className="py-2 px-4 font-medium">{i + 1}</td>
                          <td className="py-2 px-4">{m.nama}</td>
                          <td className="py-2 px-4">{m.nim}</td>
                          <td className="py-2 px-4 text-center">
                            {totalSks}
                            {maxSks ? ` / ${maxSks}` : ""}
                          </td>
                          {canDelete && (
                            <td className="py-2 px-4 text-center">
                              <button
                                onClick={() => handleDeleteMahasiswa(kls, m.id)}
                                className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600 transition"
                              >
                                Hapus
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={canDelete ? 5 : 4}
                        className="py-4 text-center text-gray-400 italic"
                      >
                        Belum ada mahasiswa dalam kelas ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Add Mahasiswa Footer */}
            {canUpdate && (
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 px-4 py-3 border-t border-gray-100 bg-gray-50">
                <select
                  value={selectedMhs[kls.id] || ""}
                  onChange={(e) =>
                    setSelectedMhs({ ...selectedMhs, [kls.id]: e.target.value })
                  }
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-64"
                >
                  <option value="">-- Pilih Mahasiswa --</option>
                  {mahasiswa.map((m) => {
                    const sudahTerdaftar = (kls.mahasiswa_ids ?? []).some(
                      (id) => isSameId(id, m.id)
                    );
                    return (
                      <option key={m.id} value={m.id} disabled={sudahTerdaftar}>
                        {m.nama} ({m.nim}){sudahTerdaftar ? " — sudah terdaftar" : ""}
                      </option>
                    );
                  })}
                </select>
                <button
                  onClick={() => handleAddMahasiswa(kls, selectedMhs[kls.id])}
                  disabled={!selectedMhs[kls.id]}
                  className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Tambah Mahasiswa
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}