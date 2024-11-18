// src/app/entradas/page.js
"use client";

import { useState } from "react";
import { db } from "../lib/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import AudioInput from "../components/AudioInput";

export default function RegistroEntradas() {
  const [data, setData] = useState({
    tipo: "Compra",
    persona: "",
    ubicacion: "Hotel Cavancha", // Nuevo campo para 'Almacenamiento'
    notas: "",
  });
  const [invoicePhotos, setInvoicePhotos] = useState([]);
  const [arrivalPhotos, setArrivalPhotos] = useState([]); // Fotos de lo que llega en 'Compra'
  const [itemPhotos, setItemPhotos] = useState([]); // Fotos de artículos en 'Almacenamiento'
  const [uploading, setUploading] = useState(false);

  const handleInvoicePhotoChange = (e) => {
    setInvoicePhotos(Array.from(e.target.files));
  };

  const handleArrivalPhotoChange = (e) => {
    setArrivalPhotos(Array.from(e.target.files));
  };

  const handleItemPhotoChange = (e) => {
    setItemPhotos(Array.from(e.target.files));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
      // Limpiar campos no utilizados
      ...(name === "tipo" && value === "Compra"
        ? { persona: "", ubicacion: "Hotel Cavancha", itemPhotos: [] }
        : name === "tipo" && value === "Almacenamiento"
        ? { invoicePhotos: [], arrivalPhotos: [] }
        : {}),
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
      formData.append("upload_preset", "inventario_preset"); // Reemplaza con tu upload preset
      formData.append("folder", folder); // Especifica la carpeta en Cloudinary

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

  const saveEntry = async () => {
    setUploading(true);

    let invoicePhotoURLs = [];
    let arrivalPhotoURLs = [];
    let itemPhotoURLs = [];

    try {
      if (data.tipo === "Compra") {
        if (invoicePhotos.length > 0) {
          invoicePhotoURLs = await uploadPhotosToCloudinary(
            invoicePhotos,
            "facturas"
          );
        }
        if (arrivalPhotos.length > 0) {
          arrivalPhotoURLs = await uploadPhotosToCloudinary(
            arrivalPhotos,
            "articulos"
          );
        }
      } else if (data.tipo === "Almacenamiento") {
        if (itemPhotos.length > 0) {
          itemPhotoURLs = await uploadPhotosToCloudinary(
            itemPhotos,
            "articulos"
          );
        }
      }

      const entryData = {
        tipo: data.tipo,
        fecha: new Date(),
        notas: data.notas,
      };

      if (data.tipo === "Compra") {
        entryData.invoicePhotoURLs = invoicePhotoURLs;
        entryData.arrivalPhotoURLs = arrivalPhotoURLs;
      } else if (data.tipo === "Almacenamiento") {
        entryData.persona = data.persona;
        entryData.ubicacion = data.ubicacion;
        entryData.itemPhotoURLs = itemPhotoURLs;
      }

      await addDoc(collection(db, "entradas"), entryData);

      alert("Entrada registrada exitosamente");

      // Reiniciar el formulario
      setData({
        tipo: "Compra",
        persona: "",
        ubicacion: "Hotel Cavancha",
        notas: "",
      });
      setInvoicePhotos([]);
      setArrivalPhotos([]);
      setItemPhotos([]);
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 display-4">Registro de Entradas</h2>

      {/* Campo: Tipo */}
      <div className="mb-3">
        <label className="form-label fw-bold">Tipo</label>
        <select
          className="form-select"
          name="tipo"
          value={data.tipo}
          onChange={handleInputChange}
        >
          <option value="Compra">Compra</option>
          <option value="Almacenamiento">Almacenamiento</option>
          {/* Agrega más opciones si es necesario */}
        </select>
      </div>

      {/* Mostrar campos específicos según el tipo */}
      {data.tipo === "Compra" && (
        <>
          {/* Campo de Fotos de Facturas */}
          <div className="mb-3">
            <label className="form-label fw-bold">Fotos de Facturas</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              multiple
              onChange={handleInvoicePhotoChange}
            />
          </div>

          {/* Campo de Fotos de lo que llega */}
          <div className="mb-3">
            <label className="form-label fw-bold">Fotos de lo que llega</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              multiple
              onChange={handleArrivalPhotoChange}
            />
          </div>
        </>
      )}

      {data.tipo === "Almacenamiento" && (
        <>
          {/* Campo: Persona con AudioInput */}
          <AudioInput
            label="Persona"
            fieldName="persona"
            value={data.persona}
            onChange={handleFieldChange}
          />

          {/* Campo: Ubicación (select) */}
          <div className="mb-3">
            <label className="form-label fw-bold">Ubicación</label>
            <select
              className="form-select"
              name="ubicacion"
              value={data.ubicacion}
              onChange={handleInputChange}
            >
              <option value="Hotel Cavancha">Hotel Cavancha</option>
              <option value="Hotel Prat">Hotel Prat</option>
              <option value="Hotel Terrado">Hotel Terrado</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          {/* Campo de Fotos de Artículos */}
          <div className="mb-3">
            <label className="form-label fw-bold">Fotos de Artículos</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              multiple
              onChange={handleItemPhotoChange}
            />
          </div>
        </>
      )}

      {/* Campo: Notas con AudioInput */}
      <AudioInput
        label="Notas"
        fieldName="notas"
        value={data.notas}
        onChange={handleFieldChange}
        as="textarea"
      />

      {/* Botón para guardar */}
      <button
        className="btn btn-success btn-lg w-100 mt-3"
        onClick={saveEntry}
        disabled={uploading}
      >
        {uploading ? "Guardando..." : "Registrar Entrada"}
      </button>

      <div className="text-center mt-4">
        <Link href="/" className="btn btn-secondary">
          Volver al Menú Principal
        </Link>
      </div>
    </div>
  );
}
