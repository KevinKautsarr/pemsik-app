import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../Components/Organisms/AuthLayout';
import Form from '../../Components/Molecules/Form';
import Button from '../../Components/Atoms/Button';
import Link from '../../Components/Atoms/Link';
import { dummyUser } from '../../Data/Dummy';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (email === dummyUser.email && password === dummyUser.password) {
      localStorage.setItem("user", JSON.stringify(dummyUser));
      alert("Verification successful. Granting access...");
      navigate('/admin');
    } else {
      alert("Email atau password salah!");
    }
  };

  return (
    <AuthLayout title="LOGIN" subtitle="">
      <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300 fill-mode-both">
        <Form 
          label="Email" 
          name="email" 
          placeholder="Masukkan email" 
          required 
          value={formData.email}
          onChange={handleChange}
        />
        <Form 
          label="Password" 
          name="password" 
          type="password" 
          placeholder="Masukkan password" 
          required 
          value={formData.password}
          onChange={handleChange}
        />
        
        <div className="flex items-center justify-between pb-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-slate-100 text-blue-600 focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer bg-slate-50" />
            <span className="text-[10px] font-black text-slate-400 group-hover:text-blue-600 uppercase tracking-widest leading-none">Ingat saya</span>
          </label>
          <Link href="#" className="text-[10px] uppercase tracking-widest font-black text-slate-400 hover:text-blue-600 transition-colors">Lupa password?</Link>
        </div>

        <Button type="submit" variant="primary" className="w-full text-xs font-black uppercase tracking-[0.4em] py-6 shadow-2xl shadow-blue-600/30">
          Login
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
