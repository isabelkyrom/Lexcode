import { supabase } from '@/lib/supabase';

export async function countFirmas(folio) {
    const { data, error } = await supabase
      .rpc('buscar_firma_por_folio', {
          folio_buscado: folio
      });

    if (error) {
        console.error("Error en RPC:", error);
        throw new Error(error.message);
    }

    return data;
}