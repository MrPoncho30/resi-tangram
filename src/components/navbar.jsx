import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
 
  function getCSRFToken() {
    return document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken'))
        ?.split('=')[1];
}

  const handleLogout = async () => {
    try {
      await fetch('https://372a-2806-10b7-3-4adc-81df-b7de-1fd0-f948.ngrok-free.app/maestros/api/cerrar_sesion_maestro/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(),
        },
      });

      
      localStorage.removeItem('authToken');

      navigate('/loginTeacher');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
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
      
        {/* <li
          className="mb-3 hover:bg-gray-700 p-2 rounded cursor-pointer"
          onClick={handleAlumnosClick}
        >
          Alumnos
        </li> */}
      </ul>
      <button
        onClick={handleLogout}
        className="mt-6 w-full bg-blue-500 hover:bg-red-600 p-2 rounded"
      >
        Salir
      </button>
    </div>
  );
};

export default Navbar;
