import React from 'react';
import Modal from '../../../Components/Organisms/Modal';
import Input from "../../../Components/Atoms/Input";
import Label from "../../../Components/Atoms/Label";

const MatakuliahModal = ({
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
      title={isEdit ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="kodemk">Kode MK</Label>
          <Input 
            name="kodemk"
            value={form.kodemk}
            onChange={onChange}
            readOnly={isEdit}
            placeholder="Masukkan Kode MK"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="nama">Nama Mata Kuliah</Label>
          <Input 
            name="nama"
            value={form.nama}
            onChange={onChange}
            placeholder="Masukkan Nama Mata Kuliah"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="sks">SKS</Label>
          <Input 
            type="number"
            name="sks"
            value={form.sks}
            onChange={onChange}
            placeholder="Masukkan Jumlah SKS"
            required
            min="1"
            max="6"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="semester">Semester</Label>
          <Input 
            type="number"
            name="semester"
            value={form.semester}
            onChange={onChange}
            placeholder="Masukkan Semester"
            required
            min="1"
            max="8"
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

export default MatakuliahModal;
