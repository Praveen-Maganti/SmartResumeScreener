import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) {
  // Prevent body scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-all animate-fade-in">
      {/* Backdrop click close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose}></div>

      {/* Modal Dialog Box */}
      <div 
        className={`bg-white w-full ${maxWidth} rounded-xl border border-slate-200 shadow-xl relative z-10 flex flex-col max-h-[90vh] animate-fade-in-up overflow-hidden`}
      >
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-6 border-b border-slate-150 shrink-0 bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-sm tracking-tight">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-150 text-slate-400 hover:text-slate-700 rounded-lg transition-colors border border-slate-200/40 bg-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
