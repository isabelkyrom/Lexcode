// src/config.js (o src/lib/supabase.js)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Esto evitará que explote y te dirá en consola si no las está leyendo bien
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ Error: Las variables de entorno de Supabase no están cargadas en el cliente.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);