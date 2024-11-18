// src/app/components/ThemeProvider.js
"use client";

import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState, useEffect } from "react";

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");

  // Cargar el tema desde localStorage al iniciar
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.setAttribute("data-bs-theme", savedTheme);
    } else {
      document.body.setAttribute("data-bs-theme", theme);
    }
  }, []);

  // Guardar el tema en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.setAttribute("data-bs-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <>
      <button className="btn btn-secondary" onClick={toggleTheme}>
        {theme === "dark" ? (
          <i className="bi bi-sun-fill"></i> // Icono de sol, indica que cambiará a claro
        ) : (
          <i className="bi bi-moon-fill"></i> // Icono de luna, indica que cambiará a oscuro
        )}
      </button>
      {children}
    </>
  );
}
