// 'use client';

// import React from 'react';
// import Image from 'next/image';
// import clsx from 'clsx';

// export interface LogoUploaderProps
//   extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
//   label?: string;
//   square?: boolean;
// }

// export default function LogoUploader({
//   square,
//   label,
//   placeholder,
//   id,
//   ...rest
// }: LogoUploaderProps) {
//   return (
//     <div
//       className={clsx(
//         'flex mb-3',
//         !square && 'gap-10',
//         square && 'gap-2 flex-col',
//       )}
//     >
//       {label && <p className="text-base color-gray-900">{label}</p>}
//       <label
//         htmlFor={id}
//         className={clsx(
//           'flex flex-col items-center justify-center h-40 bg-white border border-slate-900 border-dashed cursor-pointer',
//           !square && 'w-40 rounded-full',
//           square && 'w-full',
//         )}
//       >
//         <Image
//           className="mb-1"
//           width={48}
//           height={48}
//           src="/icons/upload.svg"
//           alt="upload"
//         />
//         {placeholder && (
//           <p className="text-base text-gray-500">{placeholder}</p>
//         )}
//         <input
//           {...rest}
//           id={id}
//           type="file"
//           accept="image/*"
//           className="hidden"
//         />
//       </label>
//     </div>
//   );
// }

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import imageCompression from 'browser-image-compression'; // ⬅️ додано

export interface LogoUploaderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  square?: boolean;
  onUpload?: (url: string) => void;
}

export default function LogoUploader({
  square,
  label,
  placeholder,
  id,
  onUpload,
  ...rest
}: LogoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];

    try {
      // ⬇️ Компресія перед завантаженням
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });

      // Прев’ю локальне
      setPreview(URL.createObjectURL(compressedFile));

      const formData = new FormData();
      formData.append('file', compressedFile);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();

      if (onUpload) onUpload(data.path);
    } catch (error) {
      console.error('File upload error:', error);
      // TODO: Вивести toast або повідомлення
    }
  };

  return (
    <div
      className={clsx(
        'flex mb-3',
        !square && 'gap-10',
        square && 'gap-2 flex-col',
      )}
    >
      {label && <p className="text-base color-gray-900">{label}</p>}
      <label
        htmlFor={id}
        className={clsx(
          'flex flex-col items-center justify-center h-40 bg-white border border-slate-900 border-dashed cursor-pointer',
          !square && 'w-40 rounded-full',
          square && 'w-full',
        )}
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className={clsx(!square ? 'rounded-full' : 'rounded-md')}
            style={{ width: 160, height: 160, objectFit: 'cover' }}
          />
        ) : (
          <>
            <Image
              className="mb-1"
              width={48}
              height={48}
              src="/icons/upload.svg"
              alt="upload"
            />
            {placeholder && (
              <p className="text-base text-gray-500">{placeholder}</p>
            )}
          </>
        )}
        <input
          {...rest}
          id={id}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}
