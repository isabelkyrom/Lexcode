'use client'
import { useState, useEffect } from 'react';
import { getIniciativas } from "../utils/getIniciativas";
import Link from "next/link";

export default function EventosPage() {

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

            <div className='w-full h-full '>

                <div className='justify-center items-center px-8 py-8'>
                    <h1 className='text-gray-600 font-semibold text-4xl text-start pb-3'>Iniciativas por Revisar</h1>
                    
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
            
                                    <Link className="mt-5 mb-2 text-white font-bold bg-velvet rounded-full py-2 px-4 transition delay-150 duration-300 ease-in-out hover:scale-104 text-center" href={`/auditores/${iniciativa.id_iniciativa}`}> Ver Firmas</Link>
                                </li>
                            ))}
                        </ul>

                    </div>


                </div>

            </div>
            
        </div>
    );
}