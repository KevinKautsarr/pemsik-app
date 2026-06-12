import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Form from '../../Components/Molecules/Form';
import { registerUser } from '../../Utils/Apis/AuthApi';
import { toastSuccess, toastError } from '../../Utils/Helpers/ToastHelpers';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      toastError("Konfirmasi password tidak cocok!");
      return;
    }
    try {
      await registerUser({ 
        name, 
        email, 
        password,
        role: 'mahasiswa',
        permission: [
          "dashboard.page",
          "mahasiswa.page",
          "mahasiswa.read",
          "dosen.page",
          "dosen.read",
          "matakuliah.page",
          "matakuliah.read",
          "krs.page",
          "krs.read"
        ]
      });
      toastSuccess("Registrasi berhasil! Silakan login.");
      navigate('/login');
    } catch (err) {
      toastError(err.message || "Gagal melakukan registrasi");
    }
  };

  return (
    <>
      <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6 font-sans">Daftar Akun</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Form 
          label="Nama Lengkap" 
          name="name" 
          type="text"
          placeholder="Masukkan nama lengkap" 
          required 
          value={formData.name}
          onChange={handleChange}
          className="mb-0"
        />
        <Form 
          label="Email" 
          name="email" 
          type="email"
          placeholder="Masukkan email" 
          required 
          value={formData.email}
          onChange={handleChange}
          className="mb-0"
        />
        <Form 
          label="Password" 
          name="password" 
          type="password" 
          placeholder="Masukkan password" 
          required 
          value={formData.password}
          onChange={handleChange}
          className="mb-0"
        />
        <Form 
          label="Konfirmasi Password" 
          name="confirmPassword" 
          type="password" 
          placeholder="Konfirmasi password" 
          required 
          value={formData.confirmPassword}
          onChange={handleChange}
          className="mb-0"
        />

        <button 
          type="submit" 
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium mt-4"
        >
          Daftar
        </button>
      </form>
      
      <p className="text-sm text-center text-gray-600 mt-4">
        Sudah punya akun? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
      </p>
    </>
  );
};

export default Register;
