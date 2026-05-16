'use client';
import { useState, useEffect } from 'react';
//import { clearToken, getToken } from '@/lib/auth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';


function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link 
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-white text-velvet font-semibold' : 'text-white font-semibold hover:bg-white hover:text-velvet'}`}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {

  return (
    <header className='bg-velvet shadow'>
      <div className='container mx-auto flex items-center justify-between py-4 px-4'>
        <Link href="/home" className='text-xl font-bold text-white'></Link>
        <nav className='flex items-center gap-2'>
          <NavLink href="/">Inicio</NavLink>
          <NavLink href="/iniciativas">Iniciativas</NavLink>
          <NavLink href="/folio">Folio</NavLink>
          <NavLink href="/crear_iniciativa">Agregar Iniciativa</NavLink>


        </nav>
      </div>
    </header>
  );
}