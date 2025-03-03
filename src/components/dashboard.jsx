import React, { useState } from 'react';
import AddStudent from './addStudent';
import StudentList from './studentList';

const Dashboard = () => {
  const [students, setStudents] = useState([]); 

  const addStudent = (student) => {
    setStudents([...students, student]); 
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Barra lateral */}
      <div className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Menú</h2>
        <ul>
          <li className="mb-4 hover:bg-gray-700 p-2 rounded cursor-pointer">Salones</li>
          <li className="mb-4 hover:bg-gray-700 p-2 rounded cursor-pointer">Actividades</li>
          <li className="mb-4 hover:bg-gray-700 p-2 rounded cursor-pointer">Alumnos</li>
        </ul>
        <button
          onClick={() => alert("Cerrar sesión")}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 p-2 rounded"
        >
          Salir
        </button>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Panel de Administrador - Profesor</h1>

        {/* Sección de los módulos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Módulo de Salones */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Salones</h2>
             <p>Modulo de salones info</p>
          </div>

          {/* Módulo de Actividades */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Actividades</h2>
            {/* Aquí puedes agregar el contenido del módulo de actividades */}
            <p>Lo mismo</p>
          </div>

          {/* Módulo de Alumnos */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Alumnos</h2>
            <AddStudent addStudent={addStudent} />
            <StudentList students={students} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
