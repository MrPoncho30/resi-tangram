
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaChalkboardTeacher, FaTasks, FaFileAlt, FaDoorOpen } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  function getCSRFToken() {
    return document.cookie.split('; ')
      .find(row => row.startsWith('csrftoken'))
      ?.split('=')[1];
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.warn('No hay token de autenticación. Redirigiendo a login.');
        navigate('/loginTeacher');
        return;
      }

      const response = await fetch(
        'http://127.0.0.1:8000/maestros/api/cerrar_sesion_maestro/', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
            'X-CSRFToken': getCSRFToken(),
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        console.error('Error al cerrar sesión:', response.statusText);
        return;
      }

      localStorage.removeItem('authToken');
      navigate('/loginTeacher');
    } catch (error) {
      console.error('Error en la solicitud de logout:', error);
    }
  };

 const navItems = [
    { path: "/salones", label: "Salones", icon: <FaChalkboardTeacher /> },
    { path: "/activitiesPanel", label: "Actividades", icon: <FaTasks /> },
    { path: "/evidencias", label: "Evidencias", icon: <FaFileAlt /> },
  ];

  return (
    <div className="w-60 bg-white bg-opacity-20 backdrop-blur-xl border-r border-white/20 p-6 min-h-screen shadow-2xl">
      <h2 
        className="text-xl font-bold text-gray-800 mb-8 text-center cursor-pointer hover:text-blue-600 transition"
        onClick={() => navigate('/dashboard')}
      >
        Menú
      </h2>

      <ul className="space-y-4">
        {navItems.map(({ path, label, icon }) => (
          <li key={path}>
            <Link
              to={path}
              className={`flex items-center p-3 rounded-lg transition-all duration-300 font-medium
                ${location.pathname === path
                  ? "bg-gray-800 text-white"
                  : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"}`}
            >
              <span className="mr-3 text-lg">{icon}</span>
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={handleLogout}
        className="mt-10 w-full bg-red-500 text-white p-3 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 flex items-center justify-center"
      >
        <FaDoorOpen className="mr-2" />
        Salir
      </button>
    </div>
  );
};

export default Navbar;
