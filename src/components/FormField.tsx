'use client';

import { memo } from 'react';
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';

interface FormFieldProps {
  id: string;
  name: string;
  type?: 'text' | 'email' | 'textarea' | 'select';
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  maxLength?: number;
  icon?: React.ReactNode;
  helpText?: string;
}

const FormField = memo(function FormField({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  placeholder,
  options,
  rows = 5,
  maxLength,
  icon,
  helpText
}: FormFieldProps) {
  const hasError = error && touched;
  const isValid = !error && value && touched;

  const inputClasses = `w-full px-4 py-3 rounded-lg border bg-background/80 focus:outline-none focus:ring-2 transition-all ${
    icon ? 'pl-10' : ''
  } ${
    hasError
      ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500'
      : isValid
      ? 'border-green-500 focus:ring-green-500/30 focus:border-green-500'
      : 'border-border focus:ring-primary/30 focus:border-primary'
  }`;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <div className="relative">
            <textarea
              id={id}
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              rows={rows}
              maxLength={maxLength}
              className={`${inputClasses} resize-y min-h-[120px]`}
              placeholder={placeholder}
              required={required}
            />
            {maxLength && (
              <div className="absolute bottom-2 right-3 text-sm">
                <span className={`${
                  value.length > maxLength * 0.9 
                    ? 'text-red-500'
                    : value.length > maxLength * 0.75
                    ? 'text-yellow-500'
                    : 'text-muted-foreground'
                }`}>
                  {value.length}/{maxLength}
                </span>
              </div>
            )}
            {icon && (
              <span className={`absolute left-3 top-6 transition-colors ${
                hasError
                  ? 'text-red-500'
                  : isValid
                  ? 'text-green-500'
                  : 'text-muted-foreground peer-focus:text-primary'
              }`}>
                {icon}
              </span>
            )}
          </div>
        );

      case 'select':
        return (
          <div className="relative">
            <select
              id={id}
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              className={`${inputClasses} appearance-none cursor-pointer`}
              required={required}
            >
              <option value="">{placeholder || `Select ${label.toLowerCase()}...`}</option>
              {options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {icon && (
              <span className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${
                hasError
                  ? 'text-red-500'
                  : isValid
                  ? 'text-green-500'
                  : 'text-muted-foreground'
              }`}>
                {icon}
              </span>
            )}
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        );

      default:
        return (
          <div className="relative">
            <input
              type={type}
              id={id}
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              className={`${inputClasses} peer`}
              placeholder={placeholder}
              required={required}
              maxLength={maxLength}
            />
            {icon && (
              <span className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                hasError
                  ? 'text-red-500'
                  : isValid
                  ? 'text-green-500'
                  : 'text-muted-foreground peer-focus:text-primary'
              }`}>
                {icon}
              </span>
            )}
          </div>
        );
    }
  };

  return (
    <div className="group">
      <label htmlFor={id} className="block text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
        {label}
        {!required && <span className="text-muted-foreground text-xs ml-1">(Optional)</span>}
        {helpText && (
          <span className="ml-1 text-muted-foreground cursor-pointer" title={helpText}>
            <svg xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        )}
      </label>
      
      {renderInput()}
      
      {/* Validation indicator */}
      {touched && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          {hasError ? (
            <FaExclamationTriangle className="text-red-500 w-4 h-4" />
          ) : isValid ? (
            <FaCheck className="text-green-500 w-4 h-4" />
          ) : null}
        </span>
      )}
      
      {/* Error message */}
      {hasError && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <FaExclamationTriangle className="w-3 h-3 mr-1" />
          {error}
        </p>
      )}
      
      {/* Success message */}
      {isValid && !hasError && (
        <p className="text-green-600 text-xs mt-1 flex items-center">
          <FaCheck className="w-3 h-3 mr-1" /> Looks good!
        </p>
      )}
    </div>
  );
});

export default FormField;