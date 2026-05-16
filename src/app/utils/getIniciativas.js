import { supabase } from '@/lib/supabase';

export async function getIniciativas() {
    const { data, error } = await supabase
      .from('iniciativas')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
}