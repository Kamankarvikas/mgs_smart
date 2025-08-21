import React, { useState, ReactNode } from 'react';
import { X } from 'lucide-react';

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary-dark focus:ring-primary',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400',
    outline: 'border border-primary text-primary hover:bg-primary-bg-hover focus:ring-primary',
    ghost: 'text-primary hover:bg-primary-bg-hover focus:ring-primary',
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  helperText?: string;
}
export const Input: React.FC<InputProps> = ({ label, id, icon, className = '', helperText, ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
        <input
          id={id}
          className={`block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm ${icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
      {helperText && <p className="mt-2 text-sm text-slate-500">{helperText}</p>}
    </div>
  );
};

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  actions?: React.ReactNode;
  noPadding?: boolean;
}
export const Card: React.FC<CardProps> = ({ children, className = '', title, actions, noPadding = false }) => {
  return (
    <div className={`bg-surface rounded-xl shadow-sm border border-slate-200/80 ${className}`}>
      {title && (
        <div className="p-4 sm:p-6 border-b border-slate-200/80 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-on-surface">{title}</h3>
          <div>{actions}</div>
        </div>
      )}
      <div className={noPadding ? '' : 'p-4 sm:p-6'}>
        {children}
      </div>
    </div>
  );
};

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 flex justify-between items-center border-b border-slate-200">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
            <X size={20} className="text-slate-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-xl flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
};

// ProgressBar Component
interface ProgressBarProps {
    value: number;
    className?: string;
}
export const ProgressBar: React.FC<ProgressBarProps> = ({ value, className }) => {
    const safeValue = Math.min(100, Math.max(0, value));
    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-slate-700">Profile Completion</span>
                <span className="text-sm font-medium text-primary">{safeValue}%</span>
            </div>
            <div className={`w-full bg-slate-200 rounded-full h-2.5 ${className}`}>
                <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${safeValue}%` }}
                ></div>
            </div>
        </div>
    );
};