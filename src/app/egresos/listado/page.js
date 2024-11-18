// src/app/egresos/listado/page.js
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

export default function ListadoEgresos() {
  const [egresos, setEgresos] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedText, setSelectedText] = useState(null);

  useEffect(() => {
    const fetchEgresos = async () => {
      const egresosRef = collection(db, "egresos");
      const querySnapshot = await getDocs(egresosRef);
      const data = querySnapshot.docs.map((doc) => {
        const egreso = doc.data();
        const fecha = egreso.fecha
          ? egreso.fecha.toDate().toLocaleString("es-CL")
          : "Sin fecha";
        return {
          id: doc.id,
          ...egreso,
          fecha,
        };
      });
      setEgresos(data);
    };

    fetchEgresos();
  }, []);

  const filteredItems = egresos.filter((item) => {
    return (
      (item.persona
        ? item.persona.toLowerCase().includes(filterText.toLowerCase())
        : true)
    );
  });

  const columns = [
    {
      name: "Hotel",
      selector: (row) => row.hotel,
      sortable: true,
    },
    {
      name: "Fecha",
      selector: (row) => row.fecha,
      sortable: true,
    },
    {
      name: "Persona",
      selector: (row) => row.persona,
      sortable: false,
      cell: ({ persona }) => (
        <div
          className="text-truncate"
          style={{ cursor: "pointer", maxWidth: "200px" }}
          onClick={() => setSelectedText({ title: "Persona", text: persona })}
        >
          {persona}
        </div>
      ),
    },
    // Agrega más columnas si es necesario
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 display-4">Listado de Egresos</h2>

      {/* Campo de búsqueda */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por persona..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      {/* Tabla de Egresos */}
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

      <div className="text-center mt-4">
        <Link href="/egresos" className="btn btn-danger">
          Registrar Nuevo Egreso
        </Link>
        <Link href="/" className="btn btn-secondary ms-2">
          Volver al Menú Principal
        </Link>
      </div>
    </div>
  );
}
