import React from 'react';
import { useNavigate } from 'react-router-dom'; 

const WaitingRoom = () => {
  const navigate = useNavigate(); 

  const handleStartClick = () => {
    navigate('/waiting'); 
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full sm:w-96 mx-4">
        <h1 className="text-3xl font-bold text-center text-[#1B396A] mb-4">
          ¡Bienvenidos al Juego!
        </h1>
        <p className="text-lg text-center text-gray-600 mb-6">
          Esperando a que los jugadores se unan...
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="playerName" className="block text-gray-700 text-sm">
              Escribe tu nombre:
            </label>
            <input
              type="text"
              id="playerName"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B396A] focus:border-[#1B396A]"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label htmlFor="gameId" className="block text-gray-700 text-sm">
              ID del juego:
            </label>
            <input
              type="text"
              id="gameId"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B396A] focus:border-[#1B396A]"
              placeholder="ID del juego"
            />
          </div>

          <button
            onClick={handleStartClick} 
            className="w-full bg-[#1B396A] text-white py-3 rounded-full hover:bg-[#2C5282] transition duration-300 mt-4"
          >
            Comenzar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
