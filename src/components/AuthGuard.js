'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  
  if (!ready) {
    return (
      <div className='bg-gray-100 min-h-screen flex justify-center items-center'>
        <div className='bg-white text-indigo-950 text-2xl font-semibold p-8 rounded-lg shadow'>
          <p className='p-4 text-center'>Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return children;
}