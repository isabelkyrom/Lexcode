"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getFirmaById } from "@/app/utils/getFirmaById";
import { updateFirmaEstado } from "@/app/utils/updateFirmaEstado";
import { getIniciativa } from "@/app/utils/getIniciativa";

export default function AuditarFirmaPage({ params }) {
  const router = useRouter();
  const { id, firmaId } = use(params);

  const [firma, setFirma] = useState(null);
  const [iniciativa, setIniciativa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const firmaData = await getFirmaById(firmaId);
        setFirma(firmaData);
        setNuevoEstado(firmaData.estado_firma);

        const iniciativaData = await getIniciativa(id);
        setIniciativa(iniciativaData);
      } catch (error) {
        console.error("Error cargando firma:", error);
        setMensaje("Error al cargar la firma");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [firmaId, id]);

  async function handleGuardarEstado() {
    if (!nuevoEstado) {
      setMensaje("Selecciona un estado válido");
      return;
    }

    setGuardando(true);
    setMensaje("");

    try {
      await updateFirmaEstado(firmaId, nuevoEstado);
      setMensaje(`Estado actualizado a: ${nuevoEstado}`);
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      console.error("Error actualizando firma:", error);
      setMensaje("Error al actualizar el estado");
    } finally {
      setGuardando(false);
    }
  }

  if (loading) {
    return <div className="p-4 text-white">Cargando...</div>;
  }

  if (!firma) {
    return <div className="p-4 text-white">No se encontró la firma.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg p-8">
        <Link href={`/auditores/${id}`} className="text-velvet font-semibold hover:underline">
          ← Volver a las firmas
        </Link>

        <h1 className="mt-4 text-4xl font-bold text-black">Auditar Firma</h1>
        <p className="mt-2 text-gray-600">Iniciativa: {iniciativa?.titulo || id}</p>

        <div className="mt-8 space-y-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Nombre</p>
            <p className="mt-1 text-base text-gray-900">{firma.nombre || "-"}</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Apellidos</p>
            <p className="mt-1 text-base text-gray-900">{firma.apellidos || "-"}</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Clave Lector</p>
            <p className="mt-1 text-base text-gray-900">{firma.clave_lector || "-"}</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Número Identificador</p>
            <p className="mt-1 text-base text-gray-900">{firma.numero_identificador || "-"}</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Hash Blockchain</p>
            <p className="mt-1 text-base text-gray-900 break-all">{firma.blockchain_hash || "No disponible"}</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Estado Actual</p>
            <p className="mt-1 text-base font-bold text-gray-900">{firma.estado_firma}</p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-gray-200 bg-gray-50 p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Cambiar Estado</label>
          <select
            value={nuevoEstado}
            onChange={(e) => setNuevoEstado(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-velvet"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobada">Aprobada</option>
            <option value="Rechazada">Rechazada</option>
          </select>
        </div>

        <button
          onClick={handleGuardarEstado}
          disabled={guardando || nuevoEstado === firma.estado_firma}
          className="mt-8 w-full rounded-full bg-velvet px-6 py-3 text-white font-bold transition duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {guardando ? "Guardando..." : "Guardar Cambios"}
        </button>

        {mensaje && (
          <p className={`mt-4 text-center text-sm font-semibold ${mensaje.includes("Error") ? "text-red-600" : "text-green-600"}`}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}
