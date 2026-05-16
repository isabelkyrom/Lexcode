"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Link from "next/link";
import { createIniciativa } from "@/app/utils/createIniciativa";

const iniciativaSchema = z.object({
  titulo: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
  documento_pdf: z.string().min(1, "Sube el documento PDF."),
});

export default function CrearIniciativaPage() {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    titulo: "",
    descripcion: "",
    documento_pdf: "",
    documento_nombre: "",
  });
  const [errors, setErrors] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setMensaje("");
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      setFormValues((prev) => ({ ...prev, documento_pdf: "", documento_nombre: "" }));
      return;
    }

    if (file.type !== "application/pdf") {
      setErrors((prev) => ({
        ...prev,
        documento_pdf: ["Solo se aceptan archivos PDF."],
      }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        documento_pdf: ["El archivo debe ser menor a 10 MB."],
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result?.toString() || "";
      setFormValues((prev) => ({
        ...prev,
        documento_pdf: result,
        documento_nombre: file.name,
      }));
      setErrors((prev) => ({ ...prev, documento_pdf: undefined }));
      setMensaje("");
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const result = iniciativaSchema.safeParse(formValues);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      setMensaje("");
      return;
    }

    setErrors({});
    setMensaje("");
    setGuardando(true);

    try {
      await createIniciativa({
        titulo: result.data.titulo.trim(),
        descripcion: result.data.descripcion.trim(),
        documento_pdf: result.data.documento_pdf,
        documento_nombre: formValues.documento_nombre,
      });

      setMensaje("✅ Iniciativa creada correctamente!");
      setTimeout(() => {
        router.push("/iniciativas");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setMensaje(error?.message || "Error al guardar la iniciativa");
      setGuardando(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg p-8">
        <Link href="/" className="text-velvet font-semibold hover:underline">
          ← Volver al inicio
        </Link>

        <h1 className="mt-4 text-4xl font-bold text-black">Crear Nueva Iniciativa</h1>
        <p className="mt-2 text-gray-600">Completa el formulario para crear una nueva iniciativa</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Título de la Iniciativa</label>
            <input
              type="text"
              name="titulo"
              value={formValues.titulo}
              onChange={handleChange}
              placeholder="Ej: Mejora en transporte público"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-velvet"
            />
            {errors.titulo && <p className="mt-1 text-sm text-red-600">{errors.titulo[0]}</p>}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
            <textarea
              name="descripcion"
              value={formValues.descripcion}
              onChange={handleChange}
              placeholder="Describe tu iniciativa en detalle..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-velvet"
            />
            {errors.descripcion && <p className="mt-1 text-sm text-red-600">{errors.descripcion[0]}</p>}
          </div>

          {/* Documento PDF */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Documento PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            {formValues.documento_nombre && (
              <p className="mt-2 text-sm text-green-600">✓ {formValues.documento_nombre}</p>
            )}
            {errors.documento_pdf && <p className="mt-1 text-sm text-red-600">{errors.documento_pdf[0]}</p>}
          </div>

          {/* Botón enviar */}
          <button
            type="submit"
            disabled={guardando}
            className="w-full mt-8 rounded-full bg-velvet px-6 py-3 text-white font-bold transition duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {guardando ? "Guardando..." : "Crear Iniciativa"}
          </button>
        </form>

        {mensaje && (
          <p className={`mt-4 text-center text-sm font-semibold ${mensaje.includes("Error") ? "text-red-600" : "text-green-600"}`}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}
