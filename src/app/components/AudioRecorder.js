"use client";

import { useState } from "react";
import { db } from "../lib/firebaseConfig"; // Tu configuración de Firebase
import { collection, addDoc } from "firebase/firestore";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
const InventoryForm = () => {
  const [fields, setFields] = useState({
    nombre: "",
    cantidad: "",
    descripcion: "",
  });
  const [isRecording, setIsRecording] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState("");

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const startRecording = (field) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("API de reconocimiento de voz no soportada en este navegador.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(field);
    };

    recognition.onend = () => {
      setIsRecording(null);
    };

    recognition.onerror = (event) => {
      console.error("Error en SpeechRecognition:", event.error);
      recognition.stop();
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setFields((prevFields) => ({
        ...prevFields,
        [field]: text,
      }));
      recognition.stop();
    };

    recognition.start();
  };

  const uploadImageToCloudinary = async () => {
    const formData = new FormData();
    formData.append("file", photo);
    formData.append("upload_preset", "inventario_preset"); // Reemplaza con tu upload preset configurado en Cloudinary

    const res = await fetch(`https://api.cloudinary.com/v1_1/dg56syr5x/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setPhotoURL(data.secure_url); // Actualiza el estado de photoURL con la URL de Cloudinary
    return data.secure_url; // Devuelve la URL de la imagen subida en Cloudinary
  };

  const saveToFirestore = async () => {
    let imageURL = "";

    if (photo) {
      imageURL = await uploadImageToCloudinary(); // Subir la imagen y obtener la URL
    }

    try {
      await addDoc(collection(db, "inventario"), {
        nombre: fields.nombre,
        cantidad: fields.cantidad,
        descripcion: fields.descripcion,
        photoURL: imageURL,
        timestamp: new Date(),
      });
      alert("Artículo guardado en el inventario");
      setFields({ nombre: "", cantidad: "", descripcion: "" });
      setPhoto(null);
      setPhotoURL("");
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 display-4">Inventario</h2>

      {/* Campo: Nombre */}
      <div className="card mb-3">
        <div className="card-body">
          <label className="form-label fw-bold">Nombre</label>
          <div className="input-group">
            <button
              className="btn btn-primary"
              onClick={() => startRecording("nombre")}
              disabled={isRecording === "nombre"}
            >
              {isRecording === "nombre" ? "Grabando..." : "Grabar"}
            </button>
            <input
              type="text"
              className="form-control fs-5"
              value={fields.nombre}
              readOnly
              placeholder="Transcripción de Nombre"
            />
          </div>
        </div>
      </div>

      {/* Campo: Cantidad */}
      <div className="card mb-3">
        <div className="card-body">
          <label className="form-label fw-bold">Cantidad</label>
          <div className="input-group">
            <button
              className="btn btn-primary"
              onClick={() => startRecording("cantidad")}
              disabled={isRecording === "cantidad"}
            >
              {isRecording === "cantidad" ? "Grabando..." : "Grabar"}
            </button>
            <input
              type="text"
              className="form-control fs-5"
              value={fields.cantidad}
              readOnly
              placeholder="Transcripción de Cantidad"
            />
          </div>
        </div>
      </div>

      {/* Campo: Descripción */}
      <div className="card mb-3">
        <div className="card-body">
          <label className="form-label fw-bold">Descripción</label>
          <div className="input-group">
            <button
              className="btn btn-primary"
              onClick={() => startRecording("descripcion")}
              disabled={isRecording === "descripcion"}
            >
              {isRecording === "descripcion" ? "Grabando..." : "Grabar"}
            </button>
            <input
              type="text"
              className="form-control fs-5"
              value={fields.descripcion}
              readOnly
              placeholder="Transcripción de Descripción"
            />
          </div>
        </div>
      </div>

      {/* Campo de Foto */}
      <div className="card mb-3">
        <div className="card-body">
          <label className="form-label fw-bold">Foto</label>
          <input type="file" className="form-control" accept="image/*" onChange={handlePhotoChange} />
        </div>
      </div>

      <button className="btn btn-success btn-lg w-100 mt-3" onClick={saveToFirestore}>
        Guardar en Inventario
      </button>

      {/* Mostrar imagen si existe photoURL */}
      {photoURL && (
        <div className="mt-3">
          <CldImage src={photoURL} width="500" height="500" crop="fill" alt="Imagen subida" />
        </div>
      )}
            <div className="text-center mt-4">
        <Link href="/" className="btn btn-secondary">
          Volver al Menú Principal
        </Link>
      </div>
    </div>
  );
};

export default InventoryForm;
