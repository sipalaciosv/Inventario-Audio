// src/app/listado/page.js
"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import { db } from "../lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import "./listado.module.css";

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
        const timestamp = item.timestamp ? new Date(item.timestamp.seconds * 1000) : null;
        return {
          id: doc.id,
          ...item,
          fecha: timestamp ? timestamp.toLocaleDateString("es-CL") : "Sin fecha",
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
      cell: (row) => (
        <div
          className="text-truncate"
          style={{ cursor: "pointer", maxWidth: "150px" }}
          onClick={() => setSelectedText({ title: "Nombre", text: row.nombre })}
        >
          {row.nombre}
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
      cell: (row) => (
        <div
          className="text-truncate"
          style={{ cursor: "pointer", maxWidth: "150px" }}
          onClick={() => setSelectedText({ title: "Descripción", text: row.descripcion })}
        >
          {row.descripcion}
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
      cell: (row) => (
        <button
          className="btn btn-info"
          onClick={() => setSelectedImage(row.photoURL)}
        >
          Ver Imagen
        </button>
      ),
      ignoreRowClick: true,
    },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.nombre && item.nombre.toLowerCase().includes(filterText.toLowerCase())
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
        pagination
        responsive
        highlightOnHover
        striped
        dense
        noDataComponent="No se encontraron resultados"
        customStyles={{
          rows: {
            style: {
              minHeight: "50px",
            },
          },
          cells: {
            style: {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },
          },
        }}
      />

      {/* Modal para mostrar la imagen */}
      {selectedImage && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Imagen del Artículo</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedImage(null)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <img src={selectedImage} alt="Imagen del artículo" className="img-fluid rounded" />
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
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedText.title}</h5>
                <button
                  type="button"
                  className="btn-close"
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
