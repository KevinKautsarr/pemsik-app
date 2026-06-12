import React from 'react';
import Modal from '../../../Components/Organisms/Modal';
import Input from "../../../Components/Atoms/Input";
import Label from "../../../Components/Atoms/Label";

const DosenModal = ({
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
      title={isEdit ? "Edit Dosen" : "Tambah Dosen"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nidn">NIDN</Label>
          <Input 
            name="nidn"
            value={form.nidn}
            onChange={onChange}
            readOnly={isEdit}
            placeholder="Masukkan NIDN"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="nama">Nama</Label>
          <Input 
            name="nama"
            value={form.nama}
            onChange={onChange}
            placeholder="Masukkan Nama"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="Masukkan Email"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="bidang">Bidang Keahlian</Label>
          <Input 
            name="bidang"
            value={form.bidang}
            onChange={onChange}
            placeholder="Masukkan Bidang Keahlian"
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

export default DosenModal;
