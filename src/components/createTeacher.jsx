import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';
import myImage from '../assets/Escritorio.png'


function CreateTeacherForm() {
  const [nombre, setFullName] = useState('');  
  const [correo, setEmail] = useState('');
  const [contrasena, setPassword] = useState('');
  const [confirmcontrasena, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (contrasena !== confirmcontrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setError('');
    
    const teacherData = {
      nombre,   
      correo,
      contrasena,
    };

    const getCSRFToken = () => {
      const cookie = document.cookie
          .split("; ")
          .find(row => row.startsWith("csrftoken="));
      return cookie ? cookie.split("=")[1] : "";
    };

    try {
      setLoading(true);
      
      const response = await fetch('http://127.0.0.1:8000/maestros/api/crear_maestros/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify(teacherData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Maestro creado exitosamente:', result);
        // Mostrar notificación de éxito
        Swal.fire({
          title: "¡Registro exitoso!",
          text: "El maestro ha sido registrado correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
          draggable: true
        }).then(() => {
          navigate('/loginTeacher'); 
        });

      } else {
        setError(result.message || 'Hubo un error al crear el maestro');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Hubo un error al procesar la solicitud');
    } finally {
      setLoading(false); 
    }
  };

  const handleGoBack = () => {
    navigate(-1);  
  };

  // return (
  //   <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${myImage})` }}>

  //     <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
  //       <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Crear Maestro</h2>
  //       <form onSubmit={handleSubmit} className="space-y-4">
  //         <div>
  //           <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
  //           <input type="text" id="nombre" value={nombre} onChange={(e) => setFullName(e.target.value)} required className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
  //         </div>
  //         <div>
  //           <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Correo</label>
  //           <input type="email" id="correo" value={correo} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
  //         </div>
  //         <div>
  //           <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">Contraseña</label>
  //           <input type="password" id="contrasena" value={contrasena} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
  //         </div>
  //         <div>
  //           <label htmlFor="confirmcontrasena" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
  //           <input type="password" id="confirmcontrasena" value={confirmcontrasena} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
  //         </div>
  //         {error && <div className="text-red-500 text-sm text-center">{error}</div>}
  //         <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition" disabled={loading}>
  //           {loading ? 'Creando...' : 'Crear Maestro'}
  //         </button>
  //       </form>

        
  //       <button 
  //         onClick={handleGoBack} 
  //         className="mt-4 w-full flex justify-center items-center bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-400 transition">
  //         <FaArrowLeft className="mr-2" /> Volver al Login
  //       </button>
  //     </div>
  //   </div>
  // );
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-100" 
      style={{ 
        backgroundImage: `url(${myImage})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backdropFilter: 'blur(10px)' 
      }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-80 p-8 rounded-2xl shadow-lg backdrop-blur-md border border-gray-200">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Crear Maestro</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
            <input 
              type="text" 
              id="nombre" 
              value={nombre} 
              onChange={(e) => setFullName(e.target.value)} 
              required 
              className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:ring-gray-600 focus:border-gray-600 placeholder-gray-400 bg-transparent"
            />
          </div>
          <div>
            <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Correo</label>
            <input 
              type="email" 
              id="correo" 
              value={correo} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:ring-gray-600 focus:border-gray-600 placeholder-gray-400 bg-transparent"
            />
          </div>
          <div>
            <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input 
              type="password" 
              id="contrasena" 
              value={contrasena} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:ring-gray-600 focus:border-gray-600 placeholder-gray-400 bg-transparent"
            />
          </div>
          <div>
            <label htmlFor="confirmcontrasena" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
            <input 
              type="password" 
              id="confirmcontrasena" 
              value={confirmcontrasena} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:ring-gray-600 focus:border-gray-600 placeholder-gray-400 bg-transparent"
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button 
            type="submit" 
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Maestro'}
          </button>
        </form>
  
        {/* Botón Volver al Login */}
        <button 
          onClick={handleGoBack} 
          className="mt-4 w-full flex justify-center items-center bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-300"
        >
          <FaArrowLeft className="mr-2" /> Volver al Login
        </button>
      </div>
    </div>
  );
  
}

export default CreateTeacherForm;
