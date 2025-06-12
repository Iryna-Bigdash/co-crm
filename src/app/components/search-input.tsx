'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import debounce from 'lodash/debounce';

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const debouncedUpdateSearchQuery = useMemo(() => 
    debounce((newQuery: string) => {
      const newParams = new URLSearchParams(searchParams.toString());

      if (newQuery.trim() === '') {
        newParams.delete('search');
      } else {
        newParams.set('search', newQuery);
      }

      router.push(`?${newParams.toString()}`);
    }, 500), [router, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    debouncedUpdateSearchQuery(e.target.value); 
  };

  return (
    <div className="relative w-96">
      <input
        type="text"
        value={searchQuery}
        placeholder='Enter company name'
        onChange={handleChange}
        className="text-sm flex-1 py-3 pl-3 pr-11 w-full h-11 rounded border border-gray-300 bg-gray-50"
      />
      <button
        type="button"
        className="absolute top-0 right-0 p-3"
        aria-label="Search"
        disabled
      >
        <Image
          width={20}
          height={20}
          src="/icons/magnifying-glass.svg"
          alt="search icon"
        />
      </button>
    </div>
  );
}

