import React from 'react';

const Input = ({ type = "text", name, placeholder, required = false, value, onChange, className = "" }) => {
  return (
    <input
      type={type}
      name={name}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 font-medium placeholder:text-slate-400 ${className}`}
    />
  );
};

export default Input;
