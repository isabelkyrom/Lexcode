import { supabase } from '@/lib/supabase';

const llave = process.env.NEXT_PUBLIC_LLAVE_SECRETA;

export async function createFirma(firma) {

  const rpcParams = {
    p_id_iniciativa: firma.id_iniciativa,
    p_nombre: firma.nombre,
    p_apellidos: firma.apellidos,
    p_clave_lector_texto: firma.clave_lector,
    p_numero_id_texto: firma.numero_identificador,
    p_llave_secreta: llave
  };

  console.log("RPC Params para subir_firma:", rpcParams);

  if (firma.blockchain_hash) {
    rpcParams.p_blockchain_hash = firma.blockchain_hash;
  }

  const { data, error } = await supabase.rpc('subir_firma', rpcParams);

  if (error) {
    console.error('Error creando firma a través de RPC subir_firma:', error);
    throw new Error(error.message);
  }

  return data;
}
