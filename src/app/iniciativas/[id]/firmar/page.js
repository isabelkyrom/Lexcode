"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { getIniciativa } from "@/app/utils/getIniciativa";

const firmaSchema = z.object({
  nombre: z.string().min(2, "Ingresa tu nombre."),
  apellidos: z.string().min(2, "Ingresa tus apellidos."),
  clave_lector: z
    .string()
    .length(18, "Clave lector debe tener exactamente 18 caracteres.")
    .regex(/^[A-Za-z0-9]+$/, "Clave lector solo acepta letras y números."),
  numero_identificador: z
    .string()
    .length(13, "Número identificador debe tener exactamente 13 caracteres.")
    .regex(/^[0-9]+$/, "Número identificador solo acepta dígitos."),
  firma_canvas_url: z
    .string()
    .min(1, "Sube el archivo de tu e-firma.")
    .refine((value) => value.startsWith("data:"), "El archivo de e-firma no es válido."),
});

function generateClaveLector() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 18 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function generateNumeroIdentificador() {
  return Array.from({ length: 13 }, () => String(Math.floor(Math.random() * 10))).join("");
}

export default function FirmarIniciativaPage({ params }) {
  const [iniciativa, setIniciativa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState({
    nombre: "",
    apellidos: "",
    clave_lector: generateClaveLector(),
    numero_identificador: generateNumeroIdentificador(),
    firma_canvas_url: "",
    firma_file_name: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const router = useRouter();

  const { id } = use(params);

  useEffect(() => {
    async function loadIniciativa() {
      try {
        if (id) {
          const data = await getIniciativa(id);
          setIniciativa(data);
        }
      } catch (error) {
        console.error("Error cargando la iniciativa:", error);
      } finally {
        setLoading(false);
      }
    }

    loadIniciativa();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setMessage("");
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      setFormValues((prev) => ({ ...prev, firma_canvas_url: "", firma_file_name: "" }));
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        firma_canvas_url: ["Formato no válido. Usa PDF, PNG o JPG."],
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        firma_canvas_url: ["El archivo debe ser menor a 5 MB."],
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result?.toString() || "";
      setFormValues((prev) => ({
        ...prev,
        firma_canvas_url: result,
        firma_file_name: file.name,
      }));
      setErrors((prev) => ({ ...prev, firma_canvas_url: undefined }));
      setMessage("");
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const result = firmaSchema.safeParse(formValues);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      setMessage("");
      return;
    }

    setErrors({});
    setMessage("");

    const nextData = {
      nombre: result.data.nombre.trim(),
      apellidos: result.data.apellidos.trim(),
      clave_lector: result.data.clave_lector.trim().toUpperCase(),
      numero_identificador: result.data.numero_identificador.trim(),
      firma_canvas_url: result.data.firma_canvas_url,
      firma_file_name: formValues.firma_file_name,
    };

    localStorage.setItem(`firma_${id}`, JSON.stringify(nextData));
    router.push(`/iniciativas/${id}/firmar/scan`);
  }

  if (loading) {
    return <div className="p-4 text-white">Cargando...</div>;
  }

  if (!iniciativa) {
    return <div className="p-4 text-white">No se encontró la iniciativa.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg p-8">
        <Link href={`/iniciativas/${id}`} className="text-velvet font-semibold hover:underline">
          ← Volver a la iniciativa
        </Link>

        <h1 className="mt-4 text-4xl font-bold text-black">Firmar iniciativa</h1>
        <p className="mt-2 text-gray-600">Iniciativa: {iniciativa.titulo}</p>
        <p className="mt-1 text-sm text-gray-500">La firma quedará ligada a esta iniciativa.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              name="nombre"
              value={formValues.nombre}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-velvet"
              placeholder="Tu nombre"
            />
            {errors.nombre && <p className="mt-2 text-sm text-red-600">{errors.nombre[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Apellidos</label>
            <input
              name="apellidos"
              value={formValues.apellidos}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-velvet"
              placeholder="Tus apellidos"
            />
            {errors.apellidos && <p className="mt-2 text-sm text-red-600">{errors.apellidos[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Clave lector</label>
            <input
              name="clave_lector"
              value={formValues.clave_lector}
              onChange={(event) => {
                const value = event.target.value.toUpperCase().slice(0, 18);
                setFormValues((prev) => ({ ...prev, clave_lector: value }));
                setErrors((prev) => ({ ...prev, clave_lector: undefined }));
                setMessage("");
              }}
              maxLength={18}
              className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 uppercase focus:outline-none focus:ring-2 focus:ring-velvet"
              placeholder="Clave lector 18 caracteres"
            />
            {errors.clave_lector && <p className="mt-2 text-sm text-red-600">{errors.clave_lector[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Número identificador</label>
            <input
              name="numero_identificador"
              value={formValues.numero_identificador}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "").slice(0, 13);
                setFormValues((prev) => ({ ...prev, numero_identificador: value }));
                setErrors((prev) => ({ ...prev, numero_identificador: undefined }));
                setMessage("");
              }}
              maxLength={13}
              className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-velvet"
              placeholder="Número identificador 13 dígitos"
            />
            {errors.numero_identificador && <p className="mt-2 text-sm text-red-600">{errors.numero_identificador[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">E-firma</label>
            <input
              type="file"
              accept="image/png,image/jpeg,application/pdf"
              onChange={handleFileChange}
              className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-velvet"
            />
            {formValues.firma_file_name && (
              <p className="mt-2 text-sm text-gray-600">Archivo seleccionado: {formValues.firma_file_name}</p>
            )}
            {errors.firma_canvas_url && <p className="mt-2 text-sm text-red-600">{errors.firma_canvas_url[0]}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-velvet px-6 py-3 text-white font-bold transition duration-200 hover:scale-105"
          >
            Siguiente
          </button>

          {message && <p className="text-green-700 text-sm font-medium">{message}</p>}
        </form>
      </div>
    </div>
  );
}
