import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Form from '../../Components/Molecules/Form';
import { login } from '../../Utils/Apis/AuthApi';
import { toastSuccess, toastError } from '../../Utils/Helpers/ToastHelpers';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    try {
      const user = await login(email, password);
      localStorage.setItem("user", JSON.stringify(user));
      toastSuccess("Login berhasil!");
      navigate('/admin');
    } catch (err) {
      toastError(err.message);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        
        <div className="flex justify-between items-center">
          <label className="flex items-center cursor-pointer">
            <input type="checkbox" className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-600">Ingat saya</span>
          </label>
          <a href="#" className="text-sm text-blue-500 hover:underline">Lupa password?</a>
        </div>

        <button 
          type="submit" 
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Login
        </button>
      </form>
      
      <p className="text-sm text-center text-gray-600 mt-4">
        Belum punya akun? <Link to="/register" className="text-blue-500 hover:underline">Daftar</Link>
      </p>
    </>
  );
};

export default Login;
