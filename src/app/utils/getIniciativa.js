import { supabase } from '@/lib/supabase';

export async function getIniciativa(id) {
    const { data, error } = await supabase
      .from('iniciativas')
      .select('*')
      .eq('id_iniciativa', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
}