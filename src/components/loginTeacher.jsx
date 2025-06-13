import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import Swal from 'sweetalert2'; 

import myImage2 from '../assets/bg-tangram.png'; 
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

      await Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        text: 'Has accedido correctamente',
        timer: 2000,
        showConfirmButton: false
      });

      if (result.id_maestro) {
        localStorage.setItem('maestro', result.id_maestro); 
      }

      const teacherId = localStorage.getItem('maestro');
      console.log('ID del maestro:', teacherId);

      navigate('/dashboard', { replace: true });
    } else {
      setError(result.message || 'Credenciales incorrectas');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: result.message || 'Credenciales incorrectas',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    setError('Hubo un error al procesar la solicitud');
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'No se pudo conectar con el servidor',
    });
  } finally {
    setLoading(false);
  }
};


  const handleCreateTeacher = () => {
    navigate('/createTeacher');
  };
  
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-200"
      style={{
        backgroundImage: `url(${myImage2})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className='absolute inset-0 bg-black opacity-50'></div>
      <div className="w-full max-w-md bg-white bg-opacity-95 p-10 rounded-2xl shadow-2xl border border-gray-300 z-20">
        <div className="flex justify-center mb-6">
          <img src={myLogo} alt="Logo" className="h-16 w-16" />
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Bienvenido Profesor</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Por favor, ingrese sus credenciales institucionales
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="correo" className="text-sm font-medium text-gray-700">Correo Institucional</label>
            <div className="relative mt-1">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaEnvelope />
              </div>
              <input
                type="email"
                id="correo"
                value={correo}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@escuela.edu.mx"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-gray-600"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contrasena" className="text-sm font-medium text-gray-700">Contraseña</label>
            <div className="relative mt-1">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaLock />
              </div>
              <input
                type="password"
                id="contrasena"
                value={contrasena}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-gray-600"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center font-medium">{error}</div>
          )}

          <div className="flex flex-col items-center">
            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
            <a
              onClick={handleCreateTeacher}
              className="group relative mt-5 inline-block text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              ¿No tiene cuenta? Crear Maestro
              <span className="absolute left-1/2 bottom-0 h-[1px] w-0 bg-gray-900 transition-all duration-300 group-hover:left-0 group-hover:w-full"></span>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginTeacher;
