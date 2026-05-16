import { supabase } from '@/lib/supabase';

export async function updateFirmaEstado(firmaId, nuevoEstado) {
  const { data, error } = await supabase
    .from('firmas')
    .update({ estado_firma: nuevoEstado })
    .eq('id_firma', firmaId)
    .select();

  if (error) {
    console.error('Error actualizando estado de firma:', error);
    throw new Error(error.message);
  }

  return data;
}
