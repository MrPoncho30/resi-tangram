import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleAlumnosClick = () => {
    navigate('/studentPage');
  };

  return (
    <div className="w-48 bg-gray-800 text-white p-4 min-h-screen">
      <h2 className="text-lg font-bold mb-6">Menú</h2>
      <ul>
        <li className="mb-3 hover:bg-gray-700 p-2 rounded cursor-pointer">
          <Link to="/salones">Salones</Link>
        </li>
        <li className="mb-3 hover:bg-gray-700 p-2 rounded cursor-pointer">
          <Link to="/actividades">Actividades</Link>
        </li>
        <li
          className="mb-3 hover:bg-gray-700 p-2 rounded cursor-pointer"
          onClick={handleAlumnosClick}
        >
          Alumnos
        </li>
      </ul>
      <button
        onClick={() => alert('Cerrar sesión')}
        className="mt-6 w-full bg-red-500 hover:bg-red-600 p-2 rounded"
      >
        Salir
      </button>
    </div>
  );
};

export default Navbar;
