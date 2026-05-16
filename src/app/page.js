'use client'
import { useState, useEffect } from 'react';
import Link from "next/link";

export default function IniciativasPage() {

    const [loading, setLoading] = useState(true);


    return(
        <div className='w-full h-full bg-gray-100 '>

            <div className='w-full h-full p-8 flex items-center justify-center'>

                <div className='w-2/5 px-8 py-8 bg-white md:p-6 shadow flex flex-col gap-6 items-center justify-center rounded-lg'>
                    <h1 className='text-gray-600 font-semibold text-4xl text-center pb-2 pt-2'>Inicio</h1>
                    
                    <div className='flex'>

                        <Link href="/iniciativas" className='mr-4 text-velvet font-bold border border-gray-200 bg-gray-50 rounded-lg p-8 transition delay-150 duration-300 ease-in-out hover:scale-104 text-center'>Ver Iniciativas</Link>


                        <Link href="/auditores" className='mr-4 text-velvet font-bold border border-gray-200 bg-gray-50 rounded-lg p-8 transition delay-150 duration-300 ease-in-out hover:scale-104 text-center'>Auditores</Link>
                        

                    </div>

                   
                    

                </div>

            </div>
            
        </div>
    );
}