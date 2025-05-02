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

  const handleEvidencias =() => {
    navigate('../evidencias')
  };

  // return (
  //   <div className="min-h-screen bg-gray-100 flex">
  //     <Navbar />
  //     <div className="flex-1 p-6">
  //       <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
  //         Panel de Administrador - Profesor
  //       </h1>
  //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
  //         <div className="bg-white p-4 rounded-lg shadow-md">
  //           <h2 className="text-lg font-semibold mb-2">Salones</h2>
  //           <p>Información sobre los salones.</p>
  //           <br></br>
  //           <button
  //               onClick={handleSalones}
  //               className="w-48 bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-800 transition"
  //             >
  //               Ver más
  //             </button>
  //         </div>
  //         <div className="bg-white p-4 rounded-lg shadow-md">
  //           <h2 className="text-lg font-semibold mb-2">Actividades</h2>
  //           <p>Descripción de las actividades.</p>
  //           <br></br>
  //           <button
  //               onClick={handleActivities}
  //               className="w-48 bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-800 transition"
  //             >
  //               Ver más
  //             </button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="min-h-screen flex bg-gradient-to-r from-gray-100 to-gray-200">
      <Navbar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Panel de Administrador - Profesor
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          
          {/* Tarjeta de Salones */}
          <div className="bg-white bg-opacity-80 p-6 rounded-xl shadow-lg backdrop-blur-md border border-gray-300">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Salones</h2>
            <p className="text-gray-600">Administra y visualiza los salones disponibles.</p>
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleSalones}
                className="w-40 bg-gray-800 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300"
              >
                Ver más
              </button>
            </div>
          </div>
  
          {/* Tarjeta de Actividades */}
          <div className="bg-white bg-opacity-80 p-6 rounded-xl shadow-lg backdrop-blur-md border border-gray-300">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Actividades</h2>
            <p className="text-gray-600">Consulta y gestiona las actividades.</p>
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleActivities}
                className="w-40 bg-gray-800 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300"
              >
                Ver más
              </button>
            </div>
          </div>


           {/* Tarjeta de Evidencias */}
           <div className="bg-white bg-opacity-80 p-6 rounded-xl shadow-lg backdrop-blur-md border border-gray-300">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Evidencias</h2>
            <p className="text-gray-600">Consulta y gestiona las evidencias.</p>
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleEvidencias}
                className="w-40 bg-gray-800 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300"
              >
                Ver más
              </button>
            </div>
          </div>
  
        </div>
      </div>
    </div>
  );
  
};

export default Dashboard;
