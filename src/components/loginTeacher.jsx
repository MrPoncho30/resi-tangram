import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import myImage from '../assets/latuyacrack.png'; 
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
  
      const response = await fetch('https://0fa9-2806-10b7-3-7dbd-48c6-c626-58a6-f949.ngrok-free.app/maestros/api/autentificar_maestro/', {
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

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${myImage})` }}></div>

      {/* Lado derecho: Formulario */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center bg-gradient-to-r from-indigo-300 to-blue-200">

        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
          <div className="flex justify-center mb-4">
            <img src={myLogo} alt="Logo" className="h-16 w-16" />
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label htmlFor="correo" className="sr-only">Correo</label>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaEnvelope />
              </div>
              <input
                type="email"
                id="correo"
                value={correo}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo Electrónico"
                required
                className="w-full px-12 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
              />
            </div>
            <div className="relative">
              <label htmlFor="contrasena" className="sr-only">Contraseña</label>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaLock />
              </div>
              <input
                type="password"
                id="contrasena"
                value={contrasena}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
                className="w-full px-12 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
              />
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <div className="flex justify-start gap-4">
              <button
                type="submit"
                className="w-48 bg-indigo-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-600 transition"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
              <button
                onClick={handleCreateTeacher}
                className="w-48 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition"
              >
                Crear Maestro
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginTeacher;