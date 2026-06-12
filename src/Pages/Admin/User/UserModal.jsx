import React from 'react';
import Modal from '../../../Components/Organisms/Modal';
import Input from "../../../Components/Atoms/Input";
import Label from "../../../Components/Atoms/Label";

const ALL_PERMISSIONS = [
  { id: "dashboard.page", label: "Dashboard Page" },
  { id: "mahasiswa.page", label: "Mahasiswa Page" },
  { id: "mahasiswa.read", label: "Mahasiswa View" },
  { id: "mahasiswa.create", label: "Mahasiswa Add" },
  { id: "mahasiswa.update", label: "Mahasiswa Edit" },
  { id: "mahasiswa.delete", label: "Mahasiswa Delete" },
  { id: "dosen.page", label: "Dosen Page" },
  { id: "dosen.read", label: "Dosen View" },
  { id: "dosen.create", label: "Dosen Add" },
  { id: "dosen.update", label: "Dosen Edit" },
  { id: "dosen.delete", label: "Dosen Delete" },
  { id: "matakuliah.page", label: "Mata Kuliah Page" },
  { id: "matakuliah.read", label: "Mata Kuliah View" },
  { id: "matakuliah.create", label: "Mata Kuliah Add" },
  { id: "matakuliah.update", label: "Mata Kuliah Edit" },
  { id: "matakuliah.delete", label: "Mata Kuliah Delete" },
  { id: "user.page", label: "User Page" },
  { id: "user.read", label: "User View" },
  { id: "user.update", label: "User Edit Roles/Perms" },
  { id: "krs.page", label: "KRS Page" },
  { id: "krs.read", label: "KRS View" }
];

const UserModal = ({
  isOpen,
  form,
  onChange,
  onPermissionToggle,
  onClose,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Edit User Role & Permissions"
    >
      <form onSubmit={onSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
        <div>
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input 
            name="name"
            value={form.name}
            onChange={onChange}
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
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="role">Role</Label>
          <select
            name="role"
            value={form.role || "mahasiswa"}
            onChange={onChange}
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 bg-white"
            required
          >
            <option value="mahasiswa">Mahasiswa</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <span className="block text-sm font-medium text-gray-700 mb-2">Permissions</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-150 max-h-60 overflow-y-auto">
            {ALL_PERMISSIONS.map((perm) => {
              const isChecked = form.permission?.includes(perm.id) || false;
              return (
                <label key={perm.id} className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer hover:bg-gray-100 p-1 rounded transition">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onPermissionToggle(perm.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{perm.label}</span>
                </label>
              );
            })}
          </div>
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
            Simpan Perubahan
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UserModal;
