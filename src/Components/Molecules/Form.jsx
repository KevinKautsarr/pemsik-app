import React from 'react';
import Label from '../Atoms/Label';
import Input from '../Atoms/Input';

const Form = ({ label, type, name, placeholder, required, value, onChange, className = "" }) => {
  return (
    <div className={`mb-6 ${className}`}>
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Form;
