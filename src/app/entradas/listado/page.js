// src/app/entradas/listado/page.js
"use client";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import DataTable, { createTheme } from "react-data-table-component";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";

// Crear un tema oscuro personalizado
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
      backgroundColor: "#333333",
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
      minHeight: "60px",
      fontSize: "18px",
    },
    highlightOnHoverStyle: {
      backgroundColor: "#333333",
      color: "#FFFFFF",
      cursor: "pointer",
    },
  },
  headCells: {
    style: {
      fontSize: "20px",
      backgroundColor: "#1a1a1a",
      color: "#FFFFFF",
    },
  },
  cells: {
    style: {
      fontSize: "18px",
    },
  },
};

export default function ListadoEntradas() {
  const [entradas, setEntradas] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [selectedText, setSelectedText] = useState(null);
  const [selectedInvoiceImages, setSelectedInvoiceImages] = useState(null);

  useEffect(() => {
    const fetchEntradas = async () => {
      const entradasRef = collection(db, "entradas");
      const querySnapshot = await getDocs(entradasRef);
      const data = querySnapshot.docs.map((doc) => {
        const entrada = doc.data();
        const fecha = entrada.fecha
          ? entrada.fecha.toDate().toLocaleString("es-CL")
          : "Sin fecha";
        return {
          id: doc.id,
          ...entrada,
          fecha,
        };
      });
      setEntradas(data);
    };

    fetchEntradas();
  }, []);

  const filteredItems = entradas.filter((item) => {
    return (
      (filterTipo ? item.tipo === filterTipo : true) &&
      (item.notas
        ? item.notas.toLowerCase().includes(filterText.toLowerCase())
        : true)
    );
  });

  const columns = [
    {
      name: "Tipo",
      selector: (row) => row.tipo,
      sortable: true,
    },
    {
      name: "Fecha",
      selector: (row) => row.fecha,
      sortable: true,
    },
    {
      name: "Notas",
      selector: (row) => row.notas,
      sortable: false,
      cell: ({ notas }) => (
        <div
          className="text-truncate"
          style={{ cursor: "pointer", maxWidth: "200px" }}
          onClick={() => setSelectedText({ title: "Notas", text: notas })}
        >
          {notas}
        </div>
      ),
    },
    // Nueva columna para Factura
    {
      name: "Factura",
      ignoreRowClick: true,
      cell: (row) =>
        row.tipo === "Compra" && row.invoicePhotoURLs && row.invoicePhotoURLs.length > 0 ? (
          <button
            className="btn btn-info"
            onClick={() => setSelectedInvoiceImages(row.invoicePhotoURLs)}
          >
            Ver Factura
          </button>
        ) : (
          <div></div>
        ),
    },
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 display-4">Listado de Entradas</h2>

      {/* Filtro por tipo */}
      <div className="mb-3">
        <label className="form-label fw-bold">Filtrar por Tipo</label>
        <select
          className="form-select"
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="Compra">Compra</option>
          <option value="Almacenamiento">Almacenamiento</option>
        </select>
      </div>

      {/* Campo de búsqueda */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por notas..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      {/* Tabla de Entradas */}
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

      {/* Modal para mostrar las facturas */}
      {selectedInvoiceImages && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark text-white border border-secondary shadow">
              <div className="modal-header">
                <h5 className="modal-title">Facturas</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedInvoiceImages(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {selectedInvoiceImages.map((url, index) => (
                    <div className="col-md-6 mb-3" key={index}>
                      <img
                        src={url}
                        alt={`Factura ${index + 1}`}
                        className="img-fluid rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedInvoiceImages(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mt-4">
        <Link href="/entradas" className="btn btn-primary">
          Registrar Nueva Entrada
        </Link>
        <Link href="/" className="btn btn-secondary ms-2">
          Volver al Menú Principal
        </Link>
      </div>
    </div>
  );
}
