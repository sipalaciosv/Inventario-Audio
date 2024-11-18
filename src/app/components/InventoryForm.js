// src/app/components/InventoryForm.js

"use client";

import { useState } from "react";
import { db } from "../lib/firebaseConfig"; // Tu configuración de Firebase
import { collection, addDoc } from "firebase/firestore";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import AudioInput from "./AudioInput"; 

const InventoryForm = () => {
  const [fields, setFields] = useState({
    nombre: "",
    cantidad: "",
    descripcion: "",
  });
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState("");

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };
  const handleFieldChange = (fieldName, value) => {
    setFields((prevFields) => ({
      ...prevFields,
      [fieldName]: value,
    }));
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
      imageURL = await uploadImageToCloudinary();
    }
  
    try {
      const inventarioRef = collection(db, "inventario");
      const q = query(
        inventarioRef,
        where("nombre", "==", fields.nombre),
        where("descripcion", "==", fields.descripcion)
      );
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // El artículo existe, actualiza la cantidad
        const docRef = querySnapshot.docs[0].ref;
        const existingData = querySnapshot.docs[0].data();
        await updateDoc(docRef, {
          cantidad:
            parseInt(existingData.cantidad) + parseInt(fields.cantidad),
          timestamp: new Date(),
        });
        alert("Cantidad actualizada en el inventario");
      } else {
        // El artículo no existe, crea uno nuevo
        await addDoc(collection(db, "inventario"), {
          ...fields,
          cantidad: parseInt(fields.cantidad),
          photoURL: imageURL,
          timestamp: new Date(),
        });
        alert("Artículo guardado en el inventario");
      }
  
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
      <AudioInput
        label="Nombre"
        fieldName="nombre"
        value={fields.nombre}
        onChange={handleFieldChange}
      />

      {/* Campo: Cantidad */}
      <AudioInput
        label="Cantidad"
        fieldName="cantidad"
        value={fields.cantidad}
        onChange={handleFieldChange}
      />

      {/* Campo: Descripción */}
      <AudioInput
        label="Descripción"
        fieldName="descripcion"
        value={fields.descripcion}
        onChange={handleFieldChange}
      />

      {/* Campo de Foto */}
      <div className="card mb-3">
        <div className="card-body">
          <label className="form-label fw-bold">Foto</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handlePhotoChange}
          />
        </div>
      </div>

      <button
        className="btn btn-success btn-lg w-100 mt-3"
        onClick={saveToFirestore}
      >
        Guardar en Inventario
      </button>

      {/* Mostrar imagen si existe photoURL */}
      {photoURL && (
        <div className="mt-3">
          <CldImage
            src={photoURL}
            width="500"
            height="500"
            crop="fill"
            alt="Imagen subida"
          />
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
