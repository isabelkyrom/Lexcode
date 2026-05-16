import { supabase } from '@/lib/supabase';

export async function createIniciativa(iniciativa) {
  const { data, error } = await supabase
    .from('iniciativas')
    .insert([
      {
        titulo: iniciativa.titulo,
        descripcion: iniciativa.descripcion,
        pdf: iniciativa.pdf,
      },
    ])
    .select();

  if (error) {
    console.error('Error creando iniciativa:', error);
    throw new Error(error.message);
  }

  return data;
}
