import React, { useState, useEffect } from "react";

const Cronometro = ({ segundosIniciales = 0, onTiempoTerminado }) => {
  const [segundosRestantes, setSegundosRestantes] = useState(segundosIniciales);

  useEffect(() => {
    if (segundosRestantes <= 0) return;

    const interval = setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onTiempoTerminado) onTiempoTerminado();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [segundosRestantes, onTiempoTerminado]);

  const horas = Math.floor(segundosRestantes / 3600);
  const minutos = Math.floor((segundosRestantes % 3600) / 60);
  const segundos = segundosRestantes % 60;

  return (
    <div className="flex flex-col items-center text-center p-2 bg-white rounded-lg">
      <h3 className="text-md font-bold text-blue-700">Tiempo restante</h3>
      <p className="text-2xl font-bold text-red-500">
        {String(horas).padStart(2, "0")}:{String(minutos).padStart(2, "0")}:{String(segundos).padStart(2, "0")}
      </p>
    </div>
  );
};

export default Cronometro;
