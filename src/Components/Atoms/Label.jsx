import React from 'react';

const Label = ({ htmlFor, children, className = "" }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-xs font-black text-slate-400 mb-2 uppercase tracking-[0.2em] ${className}`}
    >
      {children}
    </label>
  );
};

export default Label;
