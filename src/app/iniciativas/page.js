'use client'
import { useState, useEffect } from 'react';
import { getIniciativas } from "../utils/getIniciativas";
import Link from "next/link";

export default function IniciativasPage() {

    const [iniciativas, setIniciativas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function dataIniciativas() {
            try {
                const data = await getIniciativas();
                setIniciativas(data || []);
                console.log(data);
            } catch (err) {
                console.error("Error al obtener Iniciativas:", err);
            }
        }

        dataIniciativas();
    }, []);

    return(
        <div className='w-full h-full bg-gray-100 '>

            <div className='w-full h-full grid grid-cols-6'>

                <div className=' aside bg-white md:p-6 shadow flex flex-col gap-6 items-center'>
                    <div className='text-gray-600 font-semibold px-3 py-1'>
                        <button>Todos</button>
                        <button></button>
                        <button></button>
                    </div>
                </div>

                <div className='col-span-5 justify-center items-center px-8 py-8'>
                    <h1 className='text-gray-600 font-semibold text-4xl text-center pb-8 pt-2'>Iniciativas</h1>
                    
                    <div>

                        <ul className="grid grid-cols-1 gap-4">
                            {iniciativas.map((iniciativa) => (
                                <li key={iniciativa.id_iniciativa}
                                className='flex flex-col justify-between
                                border border-gray-300 bg-white shadow-[1px_0px_8px_0px_rgba(0,0,0,0.3)] rounded-lg
                                p-5
                                text-gray-600'>
                                    <span className="font-bold text-2xl text-gray-950 py-1">{iniciativa.titulo}</span> 
                                    <p className='font-bold text-gray-700 py-1'>
                                        {iniciativa.descripcion}
                                    </p>
            
                                    <Link className="mt-5 mb-2 text-white font-bold bg-velvet rounded-full py-2 px-4 transition delay-150 duration-300 ease-in-out hover:scale-104 text-center" href={`/iniciativas/${iniciativa.id_iniciativa}`}> Ver detalles</Link>
                                </li>
                            ))}
                        </ul>

                    </div>

                   
                    

                </div>

            </div>
            
        </div>
    );
}