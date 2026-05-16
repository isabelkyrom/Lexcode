import { supabase } from '@/lib/supabase';

export async function getFirmas(id) {
    // 1. Validamos que el ID sea real antes de hacer la petición
    if (!id || id === "undefined") return [];

    const { data, error } = await supabase
      .from('firmas')
      .select('*')
      .eq('id_iniciativa', id);

    if (error) {
      console.error("Error en Supabase firmas:", error.message);
      throw new Error(error.message);
    }

    // 2. Si data es null, nos aseguramos de regresar un array vacío []
    if (!data) return [];

    // 3. Filtro de seguridad: Si por alguna razón la base de datos regresó 
    // un registro donde todos los campos clave son nulos sueltos (como [null])
    return data.filter(firma => firma !== null && firma.id_firma !== null);
}