// src/app/page.js
"use client";
import Link from 'next/link';
import ThemeProvider from './components/ThemeProvider';

export default function Home() {
  return (
    <div className="container text-center mt-5">
      
      <h1 className="display-4 mb-4">Sistema de Inventario</h1>
      <p>Selecciona una opción para continuar:</p>
      
      {/* Sección de Ingresos */}
      <div className="mt-4">
        <h2 className="mb-3">Ingresos</h2>
        <div className="row justify-content-center">
          <div className="col-md-4 mb-3">
            {/* Botón para ir al Formulario de Inventario */}
            <Link href="/inventario">
              <button className="btn btn-primary btn-lg w-100">Formulario de Inventario</button>
            </Link>
          </div>
          <div className="col-md-4 mb-3">
            {/* Botón para ir al Registro de Entradas */}
            <Link href="/entradas">
              <button className="btn btn-success btn-lg w-100">Registrar Entrada</button>
            </Link>
          </div>
          <div className="col-md-4 mb-3">
            {/* Botón para ir al Registro de Egresos */}
            <Link href="/egresos">
              <button className="btn btn-danger btn-lg w-100">Registrar Egreso</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Sección de Listados */}
      <div className="mt-5">
        <h2 className="mb-3">Listados</h2>
        <div className="row justify-content-center">
          <div className="col-md-4 mb-3">
            {/* Botón para ir al Listado de Inventario */}
            <Link href="/listado">
              <button className="btn btn-secondary btn-lg w-100">Listado de Inventario</button>
            </Link>
          </div>
          <div className="col-md-4 mb-3">
            {/* Botón para ir al Listado de Entradas */}
            <Link href="/entradas/listado">
              <button className="btn btn-info btn-lg w-100">Listado de Entradas</button>
            </Link>
          </div>
          <div className="col-md-4 mb-3">
            {/* Botón para ir al Listado de Egresos */}
            <Link href="/egresos/listado">
              <button className="btn btn-warning btn-lg w-100">Listado de Egresos</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
