import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import Form from '../../Components/Molecules/Form';
import { login } from '../../Utils/Apis/AuthApi';
import { toastSuccess, toastError } from '../../Utils/Helpers/ToastHelpers';
import { useAuthStateContext } from '../../Utils/Contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStateContext();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect setelah context user terisi (hindari race condition setTimeout)
  useEffect(() => {
    if (user) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    setIsSubmitting(true);
    try {
      const loggedInUser = await login(email, password);
      setUser(loggedInUser); // Simpan ke context & localStorage, redirect ditangani useEffect
      toastSuccess('Login berhasil!');
    } catch (err) {
      toastError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-50 overflow-y-auto py-12">
      <div className="relative w-full max-w-md px-6">
        {/* Decorative blobs */}
        <div className="absolute -z-10 inset-0 hidden sm:block" aria-hidden="true">
          <div className="absolute -top-10 -right-16 w-72 h-72 bg-blue-500 rounded-[40%_60%_55%_45%/45%_55%_45%_55%] opacity-90" />
          <div className="absolute top-20 -right-24 w-64 h-64 bg-teal-300 rounded-[55%_45%_40%_60%/50%_50%_60%_40%] opacity-80" />
        </div>

        {/* Card */}
        <div className="relative bg-white rounded-2xl shadow-xl px-8 py-10">
          {/* Logo mark */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full border-[5px] border-teal-300 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-300" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-slate-800 mb-8">
            Masuk
          </h1>

          <form onSubmit={handleSubmit} className="space-y-1">
            {/* Email */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-2 focus-within:border-blue-500 transition">
              <i className="ti ti-mail text-lg text-slate-400 shrink-0" aria-hidden="true" />
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
              <i className="ti ti-lock text-lg text-slate-400 shrink-0" aria-hidden="true" />
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-sm mt-5">
            <Link to="/register" className="text-blue-600 hover:underline">
              atau Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;