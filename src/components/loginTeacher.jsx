import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import myImage from '../assets/img_login_teacher.jpg'; 
import myImage2 from '../assets/fondo.png'; 
import myLogo from '../assets/logo_tan.png';

function LoginTeacher() {
  const [correo, setEmail] = useState('');
  const [contrasena, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    const loginData = {
      correo,
      contrasena,
    };
  
    try {
      setLoading(true);
  
      const response = await fetch('http://127.0.0.1:8000/maestros/api/autentificar_maestro/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Inicio de sesión exitoso:', result);

        localStorage.setItem('accessToken', result.access_token);
        localStorage.setItem('refreshToken', result.refresh_token);

        
        alert('Inicio de sesión exitoso');
  
        if (result.id_maestro) {
          localStorage.setItem('maestro', result.id_maestro); 
        }
  
        const teacherId = localStorage.getItem('maestro');
        console.log('ID del maestro:', teacherId);
  
        alert(`ID del Maestro: ${teacherId}`);  // Muestra en un alert
  
        navigate('/dashboard');
      } else {
        setError(result.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Hubo un error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };
  

  const handleCreateTeacher = () => {
    navigate('/createTeacher');
  };

//   return (
//     <div className="min-h-screen flex">
//       <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${myImage})` }}></div>

//       {/* Lado derecho: Formulario */}
//       <div className="w-full md:w-1/2 p-8 flex items-center justify-center bg-gradient-to-b from-gray-300 to-blue-200">

//         <div className="w-full max-w-md bg-white p-8 rounded-1xl shadow-xl">
//           <div className="flex justify-center mb-4">
//             <img src={myLogo} alt="Logo" className="h-16 w-16" />
//           </div>
//           <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="relative">
//               <label htmlFor="correo" className="sr-only">Correo</label>
//               <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
//                 <FaEnvelope />
//               </div>
//               <input
//                 type="email"
//                 id="correo"
//                 value={correo}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Correo Electrónico"
//                 required
//                 className="w-full px-12 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
//               />
//             </div>
//             <div className="relative">
//               <label htmlFor="contrasena" className="sr-only">Contraseña</label>
//               <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
//                 <FaLock />
//               </div>
//               <input
//                 type="password"
//                 id="contrasena"
//                 value={contrasena}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Contraseña"
//                 required
//                 className="w-full px-12 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
//               />
//             </div>
//             {error && <div className="text-red-500 text-sm text-center">{error}</div>}
//             <div className="flex flex-col items-center">
//               <button
//                 type="submit"
//                 className="w-48 bg-blue-900 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-800 transition"
//                 disabled={loading}
//               >
//                 {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
//               </button>
//               <a
//                 onClick={handleCreateTeacher}
//                 className="mt-4 text-blue-900 font-semibold cursor-pointer hover:underline"
//               >
//                 Crear Maestro
//               </a>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
// return (
//   <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${myImage2})` }}>

//     {/* Contenedor del formulario */}
//     <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl">
//       <div className="flex justify-center mb-4">
//         <img src={myLogo} alt="Logo" className="h-16 w-16" />
//       </div>
//       <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
//         Iniciar Sesión
//       </h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="relative">
//           <label htmlFor="correo" className="sr-only">Correo</label>
//           <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
//             <FaEnvelope />
//           </div>
//           <input
//             type="email"
//             id="correo"
//             value={correo}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Correo Electrónico"
//             required
//             className="w-full px-12 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
//           />
//         </div>
//         <div className="relative">
//           <label htmlFor="contrasena" className="sr-only">Contraseña</label>
//           <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
//             <FaLock />
//           </div>
//           <input
//             type="password"
//             id="contrasena"
//             value={contrasena}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Contraseña"
//             required
//             className="w-full px-12 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
//           />
//         </div>
//         {error && <div className="text-red-500 text-sm text-center">{error}</div>}
//         <div className="flex flex-col items-center">
//           <button
//             type="submit"
//             className="w-48 bg-blue-900 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-800 transition"
//             disabled={loading}
//           >
//             {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
//           </button>
//           <a
//             onClick={handleCreateTeacher}
//             className="mt-4 text-blue-900 font-semibold cursor-pointer hover:underline"
//           >
//             Crear Maestro
//           </a>
//         </div>
//       </form>
//     </div>
//   </div>
// );

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100" 
       style={{ backgroundImage: `url(${myImage2})`, backgroundSize: 'cover', backgroundPosition: 'center', backdropFilter: 'blur(10px)' }}>

    {/* Contenedor del formulario con efecto de tarjeta flotante */}
    <div className="w-full max-w-md bg-white bg-opacity-80 p-8 rounded-2xl shadow-lg backdrop-blur-md border border-gray-200">
      <div className="flex justify-center mb-4">
        <img src={myLogo} alt="Logo" className="h-14 w-14" />
      </div>
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
        Iniciar Sesión
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label htmlFor="correo" className="sr-only">Correo</label>
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            <FaEnvelope />
          </div>
          <input
            type="email"
            id="correo"
            value={correo}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo Electrónico"
            required
            className="w-full px-12 py-3 border border-gray-300 rounded-lg focus:ring-gray-600 focus:border-gray-600 placeholder-gray-400 bg-transparent"
          />
        </div>
        <div className="relative">
          <label htmlFor="contrasena" className="sr-only">Contraseña</label>
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            <FaLock />
          </div>
          <input
            type="password"
            id="contrasena"
            value={contrasena}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            className="w-full px-12 py-3 border border-gray-300 rounded-lg focus:ring-gray-600 focus:border-gray-600 placeholder-gray-400 bg-transparent"
          />
        </div>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <div className="flex flex-col items-center">
          <button
            type="submit"
            className="w-48 bg-gray-800 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
          <a
            onClick={handleCreateTeacher}
            className="mt-4 text-gray-700 font-semibold cursor-pointer hover:underline"
          >
            Crear Maestro
          </a>
        </div>
      </form>
    </div>
  </div>
);

}

export default LoginTeacher;