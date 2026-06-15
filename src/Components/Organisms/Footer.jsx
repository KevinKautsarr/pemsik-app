import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white text-center py-4 shadow-inner border-t border-gray-100">
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-1 px-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span>📚</span>
          <span className="font-semibold text-gray-700">PEMSIK App</span>
          <span>— Sistem Manajemen Akademik</span>
        </div>
        <div className="flex items-center gap-3">
          <span>© {year} Kevin Kautsar</span>
          <span className="hidden sm:inline">·</span>
          <a
            href="https://pemsik-app.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 transition-colors duration-200 underline underline-offset-2"
          >
            pemsik-app.vercel.app
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
