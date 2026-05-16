import { supabase } from '@/lib/supabase';

export async function getFirmaById(firmaId) {
  const { data, error } = await supabase
    .from('firmas')
    .select('*')
    .eq('id_firma', firmaId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
