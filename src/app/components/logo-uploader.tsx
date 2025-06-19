'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import imageCompression from 'browser-image-compression';

export interface LogoUploaderProps {
  label?: string;
  square?: boolean;
  placeholder?: string;
  onSelect?: (file: File) => void;
}

export default function LogoUploader({
  square,
  label,
  placeholder,
  onSelect,
}: LogoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];

    const compressedFile = await imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    });

    setPreview(URL.createObjectURL(compressedFile));
    
    if (onSelect) onSelect(compressedFile); 
  };

  return (
    <div className={clsx('flex mb-3', !square && 'gap-10', square && 'gap-2 flex-col')}>
      {label && <p className="text-base color-gray-900">{label}</p>}
      <label
        className={clsx(
          'flex flex-col items-center justify-center h-40 bg-white border border-slate-900 border-dashed cursor-pointer',
          !square && 'w-40 rounded-full',
          square && 'w-full',
        )}
      >
        {preview ? (
          <Image
            src={preview}
            alt="preview"
            className={clsx(!square ? 'rounded-full' : 'rounded-md')}
            style={{ width: 160, height: 160, objectFit: 'cover' }}
          />
        ) : (
          <>
            <Image 
            width={48}
            height={48}
            style={{ objectFit: 'cover' }}
            src="/icons/upload.svg" alt="upload" />
            {placeholder && <p className="text-base text-gray-500">{placeholder}</p>}
          </>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}

