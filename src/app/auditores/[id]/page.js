"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getIniciativa } from "@/app/utils/getIniciativa";
import { getFirmas } from "../../utils/getFirmas";

// 1. ELIMINADO EL 'async' DE AQUÍ: Ahora es una función normal
export default function AuditorIniciativaPage({ params }) {
    const [firmas, setFirmas] = useState(null);
    const [iniciativa, setIniciativa] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const { id } = await params;
                console.log("1. ID del parámetro recibido:", id);
                
                if (id && id !== "undefined") {
                    // Ejecutamos por separado dentro del try para ver cuál falla
                    const iniciativaData = await getIniciativa(id);
                    console.log("2. Respuesta cruda de getIniciativa:", iniciativaData);

                    const firmasData = await getFirmas(id);
                    console.log("3. Respuesta cruda de getFirmas:", firmasData);

                    // Forzamos el estado pase lo que pase
                    setIniciativa(iniciativaData || { titulo: "Sin título", descripcion: "Sin descripción" });
                    setFirmas(firmasData || []); 
                } else {
                    console.warn("⚠️ El ID vino indefinido o vacío");
                }
            } catch (error) {
                console.error("❌ Error catastrófico en el fetchData:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [params]);

  

    if (loading) return <div className="p-4 text-white">Cargando...</div>;
    if (!firmas) return <div className="p-4 text-white">No se encontró la iniciativa.</div>;
    
    if (!iniciativa || firmas === null) {
        return <div className="p-4 text-white bg-slate-900 min-h-screen">Cargando iniciativa...</div>;  
    }

    if (!iniciativa || !firmas) {
            return <div className="p-4 text-white bg-slate-900 min-h-screen">No se encontró la iniciativa o las firmas asociadas.</div>;
        }

    return (
    <div className="h-full w-full bg-gray-100 flex flex-col items-center p-8">
        <div className="w-full bg-white text-center flex flex-col justify-center rounded-lg shadow-lg p-8 mb-8">

            <h1 key={iniciativa.id_iniciativa} className="flex flex-col m-4 w-full text-black font-bold text-4xl text-center">
                {iniciativa.titulo}
            </h1>

            <p className="text-gray-700 text-lg mb-4">
                {iniciativa.descripcion}
            </p>

            <div className="bg-white text-center flex flex-col justify-center rounded-lg shadow-lg p-8 mb-8bg-white border border-gray-300">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Firmas Recolectadas</h2>

                <ul>
                    <li className="text-gray-700 text-lg mb-2">Total de Firmas: {firmas.length}</li>
                    {firmas.map((firma) => (
                        <li key={firma.id_firma} className="text-gray-700 text-lg mb-4 bg-white p-4 rounded shadow border border-gray-300">
                            <span className="font-bold">Nombre completo:</span> {firma.nombre} {firma.apellidos} <br></br>
                            <span className="font-bold">Estado:</span> {firma.estado_firma} <br></br>
                            <Link 
                              href={`/auditores/${iniciativa.id_iniciativa}/firmar/${firma.id_firma}`}
                              className="mt-3 inline-block text-white font-bold bg-velvet rounded-full py-2 px-4 transition delay-150 duration-300 ease-in-out hover:scale-105"
                            >
                              Auditar Firma
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    </div>
  );
}