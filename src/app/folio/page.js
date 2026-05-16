'use client'
import { useState, useEffect } from 'react';
import { getFolio } from "../utils/getFolio";

export default function FoliosPage() {
    const [searchId, setSearchId] = useState(''); 
    const [folioData, setFolioData] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');


    async function handleSearch() {
        if (!searchId.trim()) return; 

        setLoading(true);
        setErrorMsg('');
        try {
            const data = await getFolio(searchId.trim()); 
            setFolioData(data || []);
        } catch (error) {
            console.error("Error fetching folio:", error);
            setErrorMsg('Hubo un error al buscar el folio.');
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className='w-full h-full bg-gray-100 '>


            <div className='w-full h-full flex flex-col justify-center items-center px-8 py-8'>
                <h1 className='text-gray-600 font-semibold text-5xl text-center pb-3'>Número de Folio</h1>

                <p className='text-center text-lg py-4'>Ingrese el número de folio previamente proporcionado para ver el estado de sus datos</p>
                
                <div className='m-4 p-4 w-full flex flex-col justify-center items-center'>

                    <input placeholder='Folio' value={searchId} onChange={(e) => setSearchId(e.target.value)}
                    className='mb-4 w-4/5 text-center border bg-white border-gray-300 rounded-full
                    px-3 py-2
                    placeholder:text-gray-400'></input>

                    <button className='mt-5 text-center bg-velvet rounded-full px-8 py-2 text-white font-bold hover:bg-velvet/90 transition delay-150 duration-300 ease-in-out hover:scale-105' 
                    onClick={handleSearch}
                    >Buscar</button>

                
                </div>
            </div>

            {folioData && (
                <div className='w-full h-full flex flex-col justify-center items-center px-8 py-8'>
                    <h2 className='text-gray-600 font-semibold text-3xl text-center pb-3'>Datos del Folio</h2>
                    <p className='text-center text-lg py-4'>{folioData.nombre}</p>
                    <p className='text-center text-lg py-4'>{folioData.apellidos}</p>
                    <p className='text-center text-lg py-4'>{folioData.estado_firma}</p>
                    <p className='text-center text-lg py-4'>{folioData.fecha_firma}</p>
                    <p className='text-center text-lg py-4'>{folioData.fecha_estado}</p>

                </div>
            )}



        </div>
    );
}