import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ActivityScreen = () => {
  const [segundos, setSegundos] = useState(10);
  const [juegoIniciado, setJuegoIniciado] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    let temporizador;
    if (juegoIniciado && segundos > 0) {
      temporizador = setInterval(() => {
        setSegundos(prev => prev - 1);
      }, 1000);
    } else if (segundos === 0) {
      clearInterval(temporizador);
      navigate("/tangram"); 
    }

    return () => clearInterval(temporizador);
  }, [juegoIniciado, segundos, navigate]);

  const manejarInicioJuego = () => {
    setJuegoIniciado(true);
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full sm:w-96 mx-4">
        <h1 className="text-3xl font-bold text-center text-[#1B396A] mb-4">
          ¡Es tu turno de construir!
        </h1>

        <div className="flex items-center justify-center mb-6">
          <div className="bg-gray-200 p-4 rounded-lg w-64 h-64 flex items-center justify-center">
            <img src="../assets/casa_tangram.png" alt="Figura a armar" />
          </div>
        </div>

        <p className="text-lg text-center text-gray-600 mb-4">
          ¡Mira bien esta figura! Pronto será tu turno de construirla
        </p>

        <p className="text-lg text-center text-[#1B396A] mb-4">
          ¡{segundos} segundos para empezar el desafío!
        </p>

        {!juegoIniciado && (
          <button
            onClick={manejarInicioJuego}
            className="w-full bg-[#1B396A] text-white py-3 rounded-full hover:bg-[#2C5282] transition duration-300 mt-4"
          >
            Comenzar Actividad
          </button>
        )}

        {juegoIniciado && segundos === 0 && (
          <p className="text-lg text-center text-red-600 mt-4">
            ¡El tiempo ha terminado!
          </p>
        )}
      </div>
    </div>
  );
};

export default ActivityScreen;
