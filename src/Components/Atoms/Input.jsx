import React from "react";

const Input = ({ type = "text", name, placeholder, required = false, value, onChange, className = "", ...props }) => {
  return (
    <input
      type={type}
      name={name}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 transition-all ${className}`}
      {...props}
    />
  );
};

export default Input;