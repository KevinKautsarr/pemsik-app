import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      {/* Backdrop click closer */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md z-10">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-2xl text-gray-600 hover:text-red-500 font-semibold focus:outline-none"
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
