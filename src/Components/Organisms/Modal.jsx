import React from 'react';
import { X } from 'lucide-react';
import Button from '../atoms/Button';
import Heading from '../atoms/Heading';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-all duration-500 animate-in fade-in"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-[3.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in slide-in-from-bottom-20 duration-700">
        <div className="px-12 py-10 border-b border-slate-50 flex items-center justify-between bg-white">
          <Heading level={2} color="text-slate-900" spacing="mb-0" align="left">{title}</Heading>
          <button 
            onClick={onClose}
            className="w-14 h-14 flex items-center justify-center bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-[1.5rem] transition-all font-black border border-slate-100"
          >
            <X size={28} />
          </button>
        </div>

        <div className="px-12 py-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>

        <div className="px-12 py-10 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose} className="px-10">Abort</Button>
          <Button variant="primary" onClick={onClose} className="px-12">Submit & Data</Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
