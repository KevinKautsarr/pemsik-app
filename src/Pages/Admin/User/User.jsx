import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUser } from '../../../Utils/Apis/UserApi';
import UserTable from './UserTable';
import UserModal from './UserModal';
import { confirmUpdate } from '../../../Utils/Helpers/SwalHelpers';
import { toastSuccess, toastError } from '../../../Utils/Helpers/ToastHelpers';
import { useAuthStateContext } from '../../../Utils/Contexts/AuthContext';

const User = () => {
  const { user: currentUser, setUser: setCurrentUser } = useAuthStateContext();

  // --- STATE MANAGEMENT ---
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', role: '', permission: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      toastError("Gagal mengambil data user");
    }
  };

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    fetchUsers();
  }, []);

  // --- FORM HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handlePermissionToggle = (permId) => {
    const currentPerms = form.permission || [];
    let newPerms;
    if (currentPerms.includes(permId)) {
      newPerms = currentPerms.filter(p => p !== permId);
    } else {
      newPerms = [...currentPerms, permId];
    }
    setForm({
      ...form,
      permission: newPerms
    });
  };

  const handleEdit = (usr) => {
    setForm({ 
      name: usr.name, 
      email: usr.email, 
      role: usr.role, 
      permission: usr.permission || [] 
    });
    setSelectedId(usr.id);
    setIsModalOpen(true);
  };

  // --- CRUD LOGIC ---
  const updateUserData = async (newData) => {
    confirmUpdate(async () => {
      try {
        const payload = {
          id: selectedId,
          ...newData
        };
        await updateUser(selectedId, payload);
        fetchUsers();
        toastSuccess("User berhasil di-edit!");
        setIsModalOpen(false);
        
        // If current logged-in user edited themselves, update AuthContext to reflect changes immediately
        if (currentUser && currentUser.id === selectedId) {
          setCurrentUser(payload);
        }
      } catch (err) {
        toastError("Gagal memperbarui data user");
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.role) {
      toastError("Semua field wajib diisi!");
      return;
    }
    updateUserData(form);
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
          <h2 className="text-lg font-semibold text-gray-800">Manajemen Akses User</h2>
        </div>

        {/* Table Users */}
        {currentUser?.permission?.includes("user.read") ? (
          <UserTable 
            data={users} 
            onEdit={handleEdit} 
          />
        ) : (
          <p className="text-center text-gray-500 py-6">Anda tidak memiliki hak akses untuk melihat manajemen user.</p>
        )}
      </div>

      {/* Modal Form */}
      <UserModal 
        isOpen={isModalOpen}
        form={form}
        onChange={handleChange}
        onPermissionToggle={handlePermissionToggle}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default User;
