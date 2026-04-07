import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] selection:bg-blue-200">
      <div className="w-full max-w-lg bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(30,64,175,0.15)] p-16 border border-white relative overflow-hidden animate-in zoom-in slide-in-from-bottom-20 duration-1000">
        {/* Decorative element */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
        
        <div className="relative z-10 text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 italic uppercase">{title}</h1>
          <p className="text-slate-400 font-black text-xs uppercase tracking-[0.4em] leading-none mb-10">{subtitle}</p>
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
