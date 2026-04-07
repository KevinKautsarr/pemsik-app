import React from 'react';

const Card = ({ children, title, className = "", noPadding = false }) => {
  return (
    <div className={`bg-white rounded-[3rem] shadow-2xl shadow-blue-900/5 border border-slate-100 overflow-hidden ${className}`}>
      {title && (
        <div className="px-10 pt-10 pb-4 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
        </div>
      )}
      <div className={noPadding ? "" : "p-10"}>
        {children}
      </div>
    </div>
  );
};

export default Card;
