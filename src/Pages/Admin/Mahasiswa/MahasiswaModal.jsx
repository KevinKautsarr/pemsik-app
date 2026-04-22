import React, { useState, useEffect } from 'react';
import Modal from '../../../Components/Organisms/Modal';
import Input from "../../../Components/Atoms/Input";
import Label from "../../../Components/Atoms/Label";
import Button from "../../../Components/Atoms/Button";

const MahasiswaModal = ({ isModalOpen, onClose, onSubmit, selectedMahasiswa }) => {
  const [form, setForm] = useState({
    nim: '',
    nama: '',
    status: true,
    ips: 0
  });

  useEffect(() => {
    if (selectedMahasiswa) {
      setForm({
        nim: selectedMahasiswa.nim,
        nama: selectedMahasiswa.nama,
        status: selectedMahasiswa.status,
        ips: selectedMahasiswa.ips
      });
    } else {
      setForm({
        nim: '',
        nama: '',
        status: true,
        ips: 0
      });
    }
  }, [selectedMahasiswa]);

  if (!isModalOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!form.nim || !form.nama) {
      alert("NIM dan Nama wajib diisi!");
      return;
    }

    onSubmit(form);
    onClose();
  };

  return (
    <Modal 
      isOpen={isModalOpen} 
      onClose={onClose} 
      title={selectedMahasiswa ? "OVERRIDE UNIT DATA" : "INITIALIZE ENTITY"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nim">Logical ID (NIM)</Label>
          <Input 
            name="nim"
            value={form.nim}
            onChange={handleChange}
            readOnly={!!selectedMahasiswa} // NIM tidak bisa diubah saat edit
            placeholder="Ex: 20211001"
            required
          />
        </div>
        <div>
          <Label htmlFor="nama">Entity Name</Label>
          <Input 
            name="nama"
            value={form.nama}
            onChange={handleChange}
            placeholder="Ex: Muhammad Kevin"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ips">Performance Index</Label>
            <Input 
              name="ips"
              type="number"
              step="0.01"
              value={form.ips}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Network Status</Label>
            <label className="flex items-center gap-2 mt-3 cursor-pointer">
              <input 
                type="checkbox"
                name="status"
                checked={form.status}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Active Link</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Abort</Button>
          <Button type="submit" className="flex-1">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};

export default MahasiswaModal;
