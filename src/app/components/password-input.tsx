'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  endAdornment?: React.ReactNode;
  toggleClassName?: string;
}

export default function PasswordInput({
  className = '',
  endAdornment,
  toggleClassName = '',
  disabled,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const hasAdornment = Boolean(endAdornment);
  const { type: _ignoredType, ...inputProps } =
    props as React.InputHTMLAttributes<HTMLInputElement>;

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      <input
        {...inputProps}
        disabled={disabled}
        type={showPassword ? 'text' : 'password'}
        autoComplete={inputProps.autoComplete ?? 'new-password'}
        className={`${className} ${hasAdornment ? 'pr-20' : 'pr-11'}`}
      />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 flex items-center pr-2">
        <div className="pointer-events-auto flex items-center gap-1">
          {endAdornment}
          <button
            type="button"
            disabled={disabled}
            onClick={handleToggle}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${toggleClassName}`}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 pointer-events-none" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5 pointer-events-none" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
