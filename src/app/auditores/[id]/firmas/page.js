"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getIniciativa } from "@/app/utils/getIniciativa";

// 1. ELIMINADO EL 'async' DE AQUÍ: Ahora es una función normal
export default function IniciativaPage({ params }) {
    const [iniciativa, setIniciativa] = useState(null);
    const [loading, setLoading] = useState(true);
    const URL = "https://dhcoawihkpnyporlzdub.supabase.co"; 

    useEffect(() => {
        // 2. La asincronía se maneja aquí adentro
        async function fetchData() {
        try {
            const { id } = await params; // Next.js requiere await en params
            
            if (id && id !== "undefined") {
                const data = await getIniciativa(id);
                setIniciativa(data);
                if (data) {
                setIniciativa(data);
                }
            }
        } catch (error) {
            console.error("Error cargando la iniciativa:", error);
        } finally {
            setLoading(false);
        }
    }

    fetchData();
  }, [params]);

  if (loading) return <div className="p-4 text-white">Cargando...</div>;
  if (!iniciativa) return <div className="p-4 text-white">No se encontró la iniciativa.</div>;

  return (
    <div className="h-full w-full bg-gray-100 flex flex-col items-center p-8">
        <div className="w-full bg-white text-center flex flex-col justify-center rounded-lg shadow-lg p-8 mb-8">

            <h1 key={iniciativa.id_iniciativa} className="flex flex-col m-4 w-full text-black font-bold text-4xl text-center">
                {iniciativa.titulo}
            </h1>

            <p className="text-gray-700 text-lg mb-4">
                {iniciativa.descripcion}
            </p>
            <p className="text-gray-700 text-lg mb-4">
                {iniciativa.meta_firmas}
            </p>


        </div>
    </div>
  );
}