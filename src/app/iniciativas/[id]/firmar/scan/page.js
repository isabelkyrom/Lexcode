"use client";

import React, { useState, useEffect, useRef, use } from "react";
import Webcam from "react-webcam";
import Link from "next/link";
import { createFirma } from "@/app/utils/createFirma";
import { getIniciativa } from "@/app/utils/getIniciativa";
import { simulateSha256, simulateBlockchainTransaction } from "@/app/utils/cryptoSim";

function FirmarScanContent({ id }) {
  const webcamRef = useRef(null);

  const [stage, setStage] = useState("INE");
  const [statusMessage, setStatusMessage] = useState("Preparando escaneo...");
  const [storedData, setStoredData] = useState(null);
  const [initiative, setInitiative] = useState(null);
  const [documentHash, setDocumentHash] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [savedFolio, setSavedFolio] = useState(null);
  const [blockchainHash, setBlockchainHash] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(`firma_${id}`);
    if (raw) {
      setStoredData(JSON.parse(raw));
    } else {
      setResultMessage("No se encontraron datos de firma. Regresa al formulario.");
    }
  }, [id]);

  useEffect(() => {
    async function loadInitiativa() {
      try {
        const data = await getIniciativa(id);
        setInitiative(data);
        const text = `${data.titulo || ""}\n\n${data.descripcion || ""}`;
        const hash = await simulateSha256(text);
        setDocumentHash(hash);
      } catch (error) {
        console.error("Error cargando la iniciativa para blockchain:", error);
      }
    }

    loadInitiativa();
  }, [id]);

  const videoConstraints = {
    facingMode: "user",
  };

  const handleUserMedia = () => {
    setCameraActive(true);
    setCameraError("");
  };

  const handleUserMediaError = (error) => {
    console.error("Error cámara:", error);
    setCameraError("No se pudo activar la cámara. Verifica los permisos del navegador.");
  };

  useEffect(() => {
    if (!storedData) return;

    if (stage === "INE") {
      setStatusMessage("Escaneando tu INE...");
      const timer = setTimeout(() => setStage("FACE"), 2200);
      return () => clearTimeout(timer);
    }

    if (stage === "FACE") {
      setStatusMessage("Escaneando tu rostro...");
      const timer = setTimeout(() => setStage("DONE"), 2200);
      return () => clearTimeout(timer);
    }

    if (stage === "DONE") {
      setStatusMessage("Escaneo completo. Pulsa finalizar para registrar la firma.");
    }
  }, [stage, storedData]);

  async function handleBlockchainSign() {
    if (!documentHash) {
      throw new Error("No se pudo calcular el hash de la iniciativa.");
    }

    // Simula una wallet conectada
    const simulatedAddress = "0x" + Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");

    setStatusMessage("Simulando transacción en blockchain...");
    
    // Simula la transacción en blockchain
    const txResult = await simulateBlockchainTransaction(documentHash, simulatedAddress);
    
    setBlockchainHash(txResult.transactionHash);
    return txResult.transactionHash;
  }

  async function handleFinish() {
    if (!storedData) {
      setResultMessage("No hay datos para guardar.");
      return;
    }

    setIsSaving(true);
    setResultMessage("");

    try {
      const blockchainHashValue = await handleBlockchainSign();

      const created = await createFirma({
        id_iniciativa: id,
        nombre: storedData.nombre,
        apellidos: storedData.apellidos,
        clave_lector: storedData.clave_lector,
        numero_identificador: storedData.numero_identificador,
        firma_canvas_url: storedData.firma_canvas_url,
        blockchain_hash: blockchainHashValue,
      });

      setSavedFolio(created ? String(created) : null);
      localStorage.removeItem(`firma_${id}`);
      setResultMessage("Firma registrada correctamente en estado pendiente.");
    } catch (saveError) {
      console.error("Error al guardar la firma:", saveError);
      setResultMessage(saveError?.message || "Error al guardar la firma. Intenta nuevamente.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg p-8">
        <Link href={`/iniciativas/${id}`} className="text-velvet font-semibold hover:underline">
          ← Volver a la iniciativa
        </Link>

        <h1 className="mt-4 text-4xl font-bold text-black">Simulación de escaneo</h1>
        <p className="mt-2 text-gray-600">Iniciativa: {initiative?.titulo || id}</p>
        <p className="mt-2 text-sm text-gray-500">Hash de la iniciativa: {documentHash || "Calculando..."}</p>
        <p className="mt-4 text-lg font-semibold text-gray-800">{statusMessage}</p>

        <div className="mt-8 rounded-3xl border border-gray-200 bg-black p-2 text-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMedia={handleUserMedia}
            onUserMediaError={handleUserMediaError}
            className="h-80 w-full rounded-3xl object-cover"
          />
          <div className="mt-4 text-left text-sm text-gray-100">
            <p>Estado de cámara: {cameraActive ? "Activa" : "Iniciando cámara..."}</p>
            {cameraError && <p className="text-red-400">{cameraError}</p>}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-600">Etapa actual:</p>
          <p className="mt-2 text-2xl font-bold text-black">
            {stage === "INE" ? "Escaneo INE" : stage === "FACE" ? "Escaneo Facial" : "Listo para finalizar"}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Nombre</p>
            <p className="mt-1 text-base text-gray-900">{storedData?.nombre || "-"}</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Apellidos</p>
            <p className="mt-1 text-base text-gray-900">{storedData?.apellidos || "-"}</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Clave lector</p>
            <p className="mt-1 text-base text-gray-900">{storedData?.clave_lector || "-"}</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Número identificador</p>
            <p className="mt-1 text-base text-gray-900">{storedData?.numero_identificador || "-"}</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Archivo e-firma</p>
            <p className="mt-1 text-base text-gray-900">{storedData?.firma_file_name || "-"}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleFinish}
          disabled={stage !== "DONE" || isSaving || !storedData}
          className="mt-8 w-full rounded-full bg-velvet px-6 py-3 text-white font-bold transition duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Guardando..." : "Finalizar firma"}
        </button>

        {resultMessage && <p className="mt-4 text-center text-sm text-gray-700">{resultMessage}</p>}
        {blockchainHash && (
          <div className="mt-4 rounded-3xl border border-blue-200 bg-blue-50 p-4 text-center text-sm text-blue-900">
            <p className="font-semibold">Hash de blockchain:</p>
            <p className="break-all">{blockchainHash}</p>
          </div>
        )}
        {savedFolio && (
          <div className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-900">
            <p className="font-semibold">Folio generado:</p>
            <p className="break-all">{savedFolio}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FirmarScanPage({ params }) {
  const { id } = use(params);
  return <FirmarScanContent id={id} />;
}
