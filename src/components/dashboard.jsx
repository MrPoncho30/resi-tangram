import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSalones = () => {
    navigate('../salones');
  };

  const handleActivities = () => {
    navigate('../activitiesPanel')
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Navbar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Panel de Administrador - Profesor
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Salones</h2>
            <p>Información sobre los salones.</p>
            <br></br>
            <button
                onClick={handleSalones}
                className="w-48 bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-800 transition"
              >
                Ver más
              </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Actividades</h2>
            <p>Descripción de las actividades.</p>
            <br></br>
            <button
                onClick={handleActivities}
                className="w-48 bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-800 transition"
              >
                Ver más
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
