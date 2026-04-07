import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-50 py-10 px-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-slate-400 text-sm font-black uppercase tracking-widest leading-none">
          © 2025 Admin Dashboard - <span className="text-blue-600">Kevin Kautsar</span>
        </div>
        <div className="flex gap-10">
          <a href="#" className="text-slate-400 hover:text-blue-600 text-xs font-black uppercase tracking-[0.2em] transition-all">Support</a>
          <a href="#" className="text-slate-400 hover:text-blue-600 text-xs font-black uppercase tracking-[0.2em] transition-all">Terms</a>
          <a href="#" className="text-slate-400 hover:text-blue-600 text-xs font-black uppercase tracking-[0.2em] transition-all">Privacy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
