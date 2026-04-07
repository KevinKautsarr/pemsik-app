import React from 'react';

const Button = ({ children, type = "button", variant = "primary", size = "md", className = "", ...props }) => {
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200/50",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200",
    warning: "bg-amber-500 hover:bg-amber-600 text-white shadow-xl shadow-amber-200/50",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-200/50",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5",
    lg: "px-8 py-4 text-lg font-black tracking-tight",
  };

  return (
    <button
      type={type}
      className={`rounded-2xl transition-all duration-300 font-bold active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
