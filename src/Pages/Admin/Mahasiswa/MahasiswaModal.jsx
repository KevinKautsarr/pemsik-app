import React from 'react';
import Modal from '../../../Components/Organisms/Modal';
import Input from "../../../Components/Atoms/Input";
import Label from "../../../Components/Atoms/Label";

const MahasiswaModal = ({
  isOpen,
  isEdit,
  form,
  onChange,
  onClose,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEdit ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nim">NIM</Label>
          <Input 
            name="nim"
            value={form.nim}
            onChange={onChange}
            readOnly={isEdit} // NIM tidak bisa diubah saat edit
            placeholder="Masukkan NIM"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="nama">Nama</Label>
          <Input 
            name="nama"
            value={form.nama || form.name || ''}
            onChange={onChange}
            placeholder="Masukkan Nama"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="nama">Max SKS</Label>
          <Input 
            type="number"
            name="max_sks"
            value={form.max_sks || ''}
            onChange={onChange}
            placeholder="Masukkan Max SKS"
            required
            className="mt-1"
          />
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <button 
            type="button" 
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition font-medium" 
            onClick={onClose}
          >
            Batal
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
          >
            Simpan
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MahasiswaModal;
