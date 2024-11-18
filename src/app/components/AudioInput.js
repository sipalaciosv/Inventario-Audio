// src/app/components/AudioInput.js
"use client";

import { useState } from "react";

export default function AudioInput({ label, fieldName, value, onChange }) {
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("API de reconocimiento de voz no soportada en este navegador.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error("Error en SpeechRecognition:", event.error);
      recognition.stop();
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onChange(fieldName, text);
      recognition.stop();
    };

    recognition.start();
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <label className="form-label fw-bold">{label}</label>
        <div className="input-group">
          <button
            className="btn btn-primary"
            onClick={startRecording}
            disabled={isRecording}
          >
            {isRecording ? "Grabando..." : "Grabar"}
          </button>
          <input
            type="text"
            className="form-control fs-5"
            value={value}
            readOnly
            placeholder={`Transcripción de ${label}`}
          />
        </div>
      </div>
    </div>
  );
}
