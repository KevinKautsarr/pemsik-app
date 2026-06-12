import React from 'react';
import Modal from '../../../Components/Organisms/Modal';
import Input from "../../../Components/Atoms/Input";
import Label from "../../../Components/Atoms/Label";

const KelasModal = ({
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
      title={isEdit ? "Edit Kelas" : "Tambah Kelas"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nama">Nama Kelas</Label>
          <Input 
            name="nama"
            value={form.nama}
            onChange={onChange}
            placeholder="Masukkan Nama Kelas (misal: TI-A)"
            required
            className="mt-1"
          />
        </div>
        <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
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

export default KelasModal;
