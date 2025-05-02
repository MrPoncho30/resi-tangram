// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const Navbar = () => {
//   const navigate = useNavigate();
 
//   function getCSRFToken() {
//     return document.cookie.split('; ')
//         .find(row => row.startsWith('csrftoken'))
//         ?.split('=')[1];
// }

// const handleLogout = async () => {
//   try {
//     const token = localStorage.getItem('authToken');

//     if (!token) {
//       console.warn('No hay token de autenticación. Redirigiendo a login.');
//       navigate('/loginTeacher');
//       return;
//     }

//     const response = await fetch(
//       'http://127.0.0.1:8000/maestros/api/cerrar_sesion_maestro/', 
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Token ${token}`,  // <-- Agregar el token aquí
//           'X-CSRFToken': getCSRFToken(),
//         },
//         credentials: 'include',  // <-- Si usas cookies de sesión
//       }
//     );

//     if (!response.ok) {
//       console.error('Error al cerrar sesión:', response.statusText);
//       return;
//     }

//     // Eliminar token y redirigir
//     localStorage.removeItem('authToken');
//     navigate('/loginTeacher');
//   } catch (error) {
//     console.error('Error en la solicitud de logout:', error);
//   }
// };


//   return (
//     <div className="w-48 bg-gray-800 text-white p-4 min-h-screen">
//       <h2 className="text-lg font-bold mb-6">Menú</h2>
//       <ul>
//         <li className="mb-3 hover:bg-gray-700 p-2 rounded cursor-pointer">
//           <Link to="/salones">Salones</Link>
//         </li>
//         <li className="mb-3 hover:bg-gray-700 p-2 rounded cursor-pointer">
//           <Link to="/activitiesPanel">Actividades</Link>
//         </li>
      
//         {/* <li
//           className="mb-3 hover:bg-gray-700 p-2 rounded cursor-pointer"
//           onClick={handleAlumnosClick}
//         >
//           Alumnos
//         </li> */}
//       </ul>
//       <button
//         onClick={handleLogout}
//         className="mt-6 w-full bg-blue-500 hover:bg-red-600 p-2 rounded"
//       >
//         Salir
//       </button>
//     </div>
//   );
// };

// export default Navbar;

// import React from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { FaDoorOpen, FaChalkboardTeacher } from "react-icons/fa";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const location = useLocation(); // Para resaltar el menú activo

//   function getCSRFToken() {
//     return document.cookie.split('; ')
//       .find(row => row.startsWith('csrftoken'))
//       ?.split('=')[1];
//   }

//   const handleLogout = async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         console.warn('No hay token de autenticación. Redirigiendo a login.');
//         navigate('/loginTeacher');
//         return;
//       }

//       const response = await fetch(
//         'http://127.0.0.1:8000/maestros/api/cerrar_sesion_maestro/', 
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Token ${token}`,
//             'X-CSRFToken': getCSRFToken(),
//           },
//           credentials: 'include',
//         }
//       );

//       if (!response.ok) {
//         console.error('Error al cerrar sesión:', response.statusText);
//         return;
//       }

//       localStorage.removeItem('authToken');
//       navigate('/loginTeacher');
//     } catch (error) {
//       console.error('Error en la solicitud de logout:', error);
//     }
//   };

//   return (
//     <div className="w-60 bg-white bg-opacity-90 backdrop-blur-md border-r border-gray-300 p-6 min-h-screen shadow-lg">
//       <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Menú</h2>
//       <ul className="space-y-3">

//         <li className={`p-3 rounded-lg cursor-pointer flex items-center transition-all duration-300 
//           ${location.pathname === "/salones" ? "bg-gray-800 text-white" : "hover:bg-gray-200"}`}>
//           <FaChalkboardTeacher className="mr-3" />
//           <Link to="/salones">Salones</Link>
//         </li>

//         <li className={`p-3 rounded-lg cursor-pointer flex items-center transition-all duration-300 
//           ${location.pathname === "/activitiesPanel" ? "bg-gray-800 text-white" : "hover:bg-gray-200"}`}>
//           <FaChalkboardTeacher className="mr-3" />
//           <Link to="/activitiesPanel">Actividades</Link>
//         </li>

//       </ul>

//       {/* Botón de salir */}
//       <button
//         onClick={handleLogout}
//         className="mt-10 w-full bg-red-500 text-white p-3 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 flex items-center justify-center"
//       >
//         <FaDoorOpen className="mr-2" />
//         Salir
//       </button>
//     </div>
//   );
// };

// export default Navbar;

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaDoorOpen, FaChalkboardTeacher, FaHome } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Para resaltar el menú activo

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

  return (
    <div className="w-60 bg-white bg-opacity-90 backdrop-blur-md border-r border-gray-300 p-6 min-h-screen shadow-lg">
      
      {/* Botón "Menú" que redirige al Dashboard */}
      <h2 
        className="text-xl font-bold text-gray-800 mb-6 text-center cursor-pointer hover:text-blue-600 transition"
        onClick={() => navigate('/dashboard')}
      >
        Menú
      </h2>

      <ul className="space-y-3">
        <li className={`p-3 rounded-lg cursor-pointer flex items-center transition-all duration-300 
          ${location.pathname === "/salones" ? "bg-gray-800 text-white" : "hover:bg-gray-200"}`}>
          <FaChalkboardTeacher className="mr-3" />
          <Link to="/salones">Salones</Link>
        </li>

        <li className={`p-3 rounded-lg cursor-pointer flex items-center transition-all duration-300 
          ${location.pathname === "/activitiesPanel" ? "bg-gray-800 text-white" : "hover:bg-gray-200"}`}>
          <FaChalkboardTeacher className="mr-3" />
          <Link to="/activitiesPanel">Actividades</Link>
        </li>

        <li className={`p-3 rounded-lg cursor-pointer flex items-center transition-all duration-300 
          ${location.pathname === "/evidencias" ? "bg-gray-800 text-white" : "hover:bg-gray-200"}`}>
          <FaChalkboardTeacher className="mr-3" />
          <Link to="/evidencias">Evidencias</Link>
        </li>
      </ul>

      {/* Botón de salir */}
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
