import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleViewStudentList = () => {
    navigate('/studentPage');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Navbar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Panel de Administrador - Profesor
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Salones</h2>
            <p>Información sobre los salones.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Actividades</h2>
            <p>Descripción de las actividades.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Alumnos</h2>
            <p> Lorem ipsum dolor sit amet. </p>
            <br></br>
            <button
              onClick={handleViewStudentList}
              className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Ver Alumnos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
