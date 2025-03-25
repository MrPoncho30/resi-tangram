import React from 'react';
import { useNavigate } from 'react-router-dom';

const WaitingScreen = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/activity');
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full sm:w-96 mx-4">
        <h1 className="text-3xl font-bold text-center text-[#1B396A] mb-4">
          ¡Ya casi! Solo falta un poquito para empezar el juego.
        </h1>
        <p className="text-lg text-center text-gray-600 mb-6">
          ¡Tus amigos están llegando! Enseguida empezamos el juego.
        </p>
        
        <button
          onClick={handleStartClick}  
          className="w-full bg-[#1B396A] text-white py-3 rounded-full hover:bg-[#2C5282] transition duration-300 mt-4"
        >
          Comenzar
        </button>
      </div>
    </div>
  );
};

export default WaitingScreen;
