'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Conectando a Supabase...')

  useEffect(() => {
    async function testConnection() {
      // Intentamos leer cualquier cosa de una tabla (ej. 'profiles' o 'signatures')
      // Si la tabla no existe, Supabase igual responderá si la conexión es exitosa
      const { error } = await supabase.from('firmas_iniciativa').select('*').limit(1)

      if (error && error.code !== 'PGRST116') { // PGRST116 significa tabla vacía/no encontrada, pero hubo conexión
        console.error('Error de conexión:', error)
        setStatus('error')
        setMessage(`Error: ${error.message}`)
      } else {
        setStatus('success')
        setMessage('¡Conexión exitosa! El cliente de Supabase está listo.')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-10 font-sans">
      <h1 className="text-2xl font-bold mb-4">Prueba de Conexión</h1>
      <div className={`p-4 rounded ${status === 'success' ? 'bg-green-100 text-green-800' : status === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
        {message}
      </div>
    </div>
  )
}