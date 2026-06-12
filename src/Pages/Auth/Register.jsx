import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../Utils/Apis/AuthApi';
import { toastSuccess, toastError } from '../../Utils/Helpers/ToastHelpers';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toastError('Konfirmasi password tidak cocok!');
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser({
        name,
        email,
        password,
        role: 'mahasiswa',
        permission: [
          'dashboard.page',
          'mahasiswa.page',
          'mahasiswa.read',
          'dosen.page',
          'dosen.read',
          'matakuliah.page',
          'matakuliah.read',
          'krs.page',
          'krs.read',
        ],
      });

      toastSuccess('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (err) {
      toastError(err.message || 'Gagal melakukan registrasi');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-50 overflow-y-auto py-12">
      {/* Decorative blobs */}
      <div
        className="absolute -z-10 inset-0 hidden sm:block"
        aria-hidden="true"
      >
        <div className="absolute -top-10 -right-16 w-72 h-72 bg-blue-500 rounded-[40%_60%_55%_45%/45%_55%_45%_55%] opacity-90" />
        <div className="absolute top-20 -right-24 w-64 h-64 bg-teal-300 rounded-[55%_45%_40%_60%/50%_50%_60%_40%] opacity-80" />
      </div>

      <div className="relative w-full max-w-md px-6">
        <div className="relative bg-white rounded-2xl shadow-xl px-8 py-10">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full border-[5px] border-teal-300 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-300" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">
            Daftar Akun
          </h1>

          <p className="text-center text-sm text-slate-500 mb-8">
            Buat akun baru untuk mengakses sistem akademik
          </p>

          <form onSubmit={handleSubmit} className="space-y-1">
            {/* Nama */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-2 focus-within:border-blue-500 transition">
              <i className="ti ti-user text-lg text-slate-400 shrink-0" />
              <input
                type="text"
                name="name"
                placeholder="Nama Lengkap"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
              />
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-2 pt-5 focus-within:border-blue-500 transition">
              <i className="ti ti-mail text-lg text-slate-400 shrink-0" />
              <input
                type="email"
                name="email"
                placeholder="nama@akademika.ac.id"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
              />
            </div>

            {/* Password */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-2 pt-5 focus-within:border-blue-500 transition">
              <i className="ti ti-lock text-lg text-slate-400 shrink-0" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
              />
            </div>

            {/* Konfirmasi Password */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-2 pt-5 focus-within:border-blue-500 transition">
              <i className="ti ti-shield-lock text-lg text-slate-400 shrink-0" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Konfirmasi Password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Memproses...' : 'Daftar'}
            </button>
          </form>

          <p className="text-center text-sm mt-5">
            Sudah punya akun?{' '}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
