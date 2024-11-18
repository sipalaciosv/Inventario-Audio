// src/app/listado/page.js
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "../lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import DataTable, { createTheme } from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";


function capitalizeFirstLetter(text) {
  if (!text) return ''; // Maneja casos donde el texto puede ser null o undefined
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
// Crear un tema oscuro personalizado (opcional)
createTheme(
  "dark",
  {
    text: {
      primary: "#FFFFFF",
      secondary: "#E5E5E5",
    },
    background: {
      default: "#1a1a1a",
    },
    context: {
      background: "#333333",
      text: "#FFFFFF",
    },
    divider: {
      default: "#454545",
    },
    action: {
      button: "rgba(255,255,255,.54)",
      hover: "rgba(255,255,255,.08)",
      disabled: "rgba(255,255,255,.12)",
    },
  },
  "dark"
);

// Estilos personalizados para la tabla
const customStyles = {
  rows: {
    style: {
      minHeight: "60px", // Aumenta la altura de las filas
      fontSize: "18px", // Aumenta el tamaño de la fuente en las filas
    },
    highlightOnHoverStyle: {
      backgroundColor: "#333333",
      color: "#FFFFFF",
      cursor: "pointer",
    },
  },
  headCells: {
    style: {
      fontSize: "20px", // Aumenta el tamaño de la fuente en los encabezados
      backgroundColor: "#1a1a1a",
      color: "#FFFFFF",
    },
  },
  cells: {
    style: {
      fontSize: "18px", // Aumenta el tamaño de la fuente en las celdas
    },
  },
};

export default function ListadoPage() {
  const [items, setItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedText, setSelectedText] = useState(null);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "inventario"));
      const data = querySnapshot.docs.map((doc) => {
        const item = doc.data();
        const timestamp = item.timestamp
          ? new Date(item.timestamp.seconds * 1000)
          : null;
        return {
          id: doc.id,
          ...item,
          fecha: timestamp
            ? timestamp.toLocaleDateString("es-CL")
            : "Sin fecha",
        };
      });
      setItems(data);
    };

    fetchItems();
  }, []);

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
      cell: ({ nombre }) => (
        <div
          className="text-truncate"
          style={{ cursor: "pointer", maxWidth: "150px" }}
          onClick={() => setSelectedText({ title: "Nombre", text: nombre })}
        >
          {capitalizeFirstLetter(nombre)}
        </div>
      ),
    },
    {
      name: "Cantidad",
      selector: (row) => row.cantidad,
      sortable: true,
    },
    {
      name: "Descripción",
      selector: (row) => row.descripcion,
      sortable: true,
      cell: ({ descripcion }) => (
        <div
          className="text-truncate"
          style={{ cursor: "pointer", maxWidth: "150px" }}
          onClick={() =>
            setSelectedText({ title: "Descripción", text: descripcion })
          }
        >
           {capitalizeFirstLetter(descripcion)}
        </div>
      ),
    },
    {
      name: "Fecha",
      selector: (row) => row.fecha,
      sortable: true,
    },
    {
      name: "Imagen",
      ignoreRowClick: true,
      cell: ({ photoURL }) => (
        <button
          className="btn btn-info"
          onClick={() => setSelectedImage(photoURL)}
        >
          Ver Imagen
        </button>
      ),
    },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.nombre &&
      item.nombre.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 display-5">Listado de Inventario</h2>

      {/* Campo de Búsqueda */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      {/* Tabla de Inventario */}
      <DataTable
        columns={columns}
        data={filteredItems}
        customStyles={customStyles}
        theme="dark"
        pagination
        highlightOnHover
        pointerOnHover
        responsive
        noDataComponent="No se encontraron resultados"
      />

      {/* Modal para mostrar la imagen */}
      {selectedImage && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border border-secondary shadow">
              <div className="modal-header">
                <h5 className="modal-title">Imagen del Artículo</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedImage(null)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={selectedImage}
                  alt="Imagen del artículo"
                  className="img-fluid rounded"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedImage(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para mostrar texto completo */}
      {selectedText && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border border-secondary shadow">
              <div className="modal-header">
                <h5 className="modal-title">{selectedText.title}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedText(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>{selectedText.text}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedText(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mt-4">
        <Link href="/" className="btn btn-secondary">
          Volver al Menú Principal
        </Link>
      </div>
    </div>
  );
}
