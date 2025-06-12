import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaChalkboardTeacher, FaTasks, FaFileAlt, FaDoorOpen, FaHome } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  function getCSRFToken() {
    return document.cookie.split('; ')
      .find(row => row.startsWith('csrftoken'))
      ?.split('=')[1];
  }

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Deseas cerrar sesión?',
      text: 'Tendrás que iniciar sesión nuevamente para continuar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.warn('No hay token de autenticación. Redirigiendo a login.');
        navigate('/loginTeacher', { replace: true });
        return;
      }

      const response = await fetch(
        'http://127.0.0.1:8000/maestros/api/cerrar_sesion_maestro/', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // ✅ CORREGIDO: antes decía "Token"
            'X-CSRFToken': getCSRFToken(),
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        console.error('Error al cerrar sesión:', response.statusText);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cerrar sesión correctamente.',
        });
        return;
      }

      // ✅ Limpieza completa
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('maestro');

      await Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión exitosamente.',
        timer: 1500,
        showConfirmButton: false
      });

      navigate('/loginTeacher', { replace: true });

    } catch (error) {
      console.error('Error en la solicitud de logout:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de red',
        text: 'No se pudo conectar con el servidor.',
      });
    }
  };

  const navItems = [
    { path: "/dashboard", label: "Menu", icon: <FaHome/>},
    { path: "/salones", label: "Salones", icon: <FaChalkboardTeacher /> },
    { path: "/activitiesPanel", label: "Actividades", icon: <FaTasks /> },
    { path: "/evidencias", label: "Evidencias", icon: <FaFileAlt /> },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-60 bg-gray-300 bg-opacity-20 backdrop-blur-xl border-r border-white/20 p-6 shadow-2xl z-50">
      <h2 className="text-xl font-bold text-black-800 mb-8 text-center transition flex items-center justify-center gap-2">
        Dashboard
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
