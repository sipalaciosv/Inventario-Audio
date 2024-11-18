// src/app/egresos/page.js
"use client";

import { useState } from "react";
import { db } from "../lib/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import Link from "next/link";
import AudioInput from "../components/AudioInput";

export default function RegistroEgresos() {
  const [data, setData] = useState({
    hotel: "Hotel Cavancha",
    persona: "",
    notas: "",
  });
  const [outgoingPhotos, setOutgoingPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleOutgoingPhotoChange = (e) => {
    setOutgoingPhotos(Array.from(e.target.files));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleFieldChange = (fieldName, value) => {
    setData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const uploadPhotosToCloudinary = async (photos, folder) => {
    const urls = [];

    for (const photo of photos) {
      const formData = new FormData();
      formData.append("file", photo);
      formData.append("upload_preset", "inventario_preset");
      formData.append("folder", folder);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dg56syr5x/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      urls.push(data.secure_url);
    }

    return urls;
  };

  const saveEgreso = async () => {
    setUploading(true);

    let outgoingPhotoURLs = [];

    try {
      if (outgoingPhotos.length > 0) {
        outgoingPhotoURLs = await uploadPhotosToCloudinary(
          outgoingPhotos,
          "egresos"
        );
      }

      await addDoc(collection(db, "egresos"), {
        ...data,
        fecha: new Date(),
        outgoingPhotoURLs,
      });

      alert("Egreso registrado exitosamente");

      // Reiniciar el formulario
      setData({
        hotel: "Hotel Cavancha",
        persona: "",
        notas: "",
      });
      setOutgoingPhotos([]);
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 display-4">Registro de Egresos</h2>

      {/* Campo: Hotel */}
      <div className="mb-3">
        <label className="form-label fw-bold">Hotel</label>
        <select
          className="form-select"
          name="hotel"
          value={data.hotel}
          onChange={handleInputChange}
        >
          <option value="Hotel Cavancha">Hotel Cavancha</option>
          <option value="Hotel Prat">Hotel Prat</option>
          <option value="Hotel Terrado">Hotel Terrado</option>
          <option value="Otros">Otros</option>
        </select>
      </div>

      {/* Campo: Persona con AudioInput */}
      <AudioInput
        label="Persona"
        fieldName="persona"
        value={data.persona}
        onChange={handleFieldChange}
      />

      {/* Campo: Notas con AudioInput */}
      <AudioInput
        label="Notas"
        fieldName="notas"
        value={data.notas}
        onChange={handleFieldChange}
        as="textarea"
      />

      {/* Campo de Fotos de lo que sale */}
      <div className="mb-3">
        <label className="form-label fw-bold">Fotos de lo que sale</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          multiple
          onChange={handleOutgoingPhotoChange}
        />
      </div>

      {/* Botón para guardar */}
      <button
        className="btn btn-danger btn-lg w-100 mt-3"
        onClick={saveEgreso}
        disabled={uploading}
      >
        {uploading ? "Guardando..." : "Registrar Egreso"}
      </button>

      <div className="text-center mt-4">
        <Link href="/" className="btn btn-secondary">
          Volver al Menú Principal
        </Link>
      </div>
    </div>
  );
}
