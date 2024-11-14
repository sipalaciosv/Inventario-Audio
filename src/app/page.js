// src/app/page.js
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-4 mb-4">Sistema de Inventario</h1>
      <p>Selecciona una opción para continuar:</p>
      
      <div className="d-flex justify-content-center gap-3 mt-4">
        {/* Botón para ir al Formulario de Inventario */}
        <Link href="/inventario">
          <button className="btn btn-primary btn-lg">Formulario de Inventario</button>
        </Link>
        
        {/* Botón para ir al Listado de Inventario */}
        <Link href="/listado">
          <button className="btn btn-secondary btn-lg">Listado de Inventario</button>
        </Link>
      </div>
    </div>
  );
}
