'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';


function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link 
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-slate-200 text-slate-900' : 'text-white font-semibold hover:bg-slate-100 hover:text-slate-900'}`}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const router = useRouter();

  return (
    <header className='bg-indigo-900 shadow'>
      <div className='container mx-auto flex items-center justify-between py-4 px-4'>
        <Link href="/home" className='text-xl font-bold text-white'>Gestión Personal</Link>
        <nav className='flex items-center gap-2'>
          <NavLink href="/">Inicio</NavLink>
          <NavLink href="/home">Home</NavLink>


        </nav>
      </div>
    </header>
  );
}