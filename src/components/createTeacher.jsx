import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

      console.log(teacherData)

      const response = await fetch('https://3583-2806-10b7-3-135a-291f-ff9f-106e-c5d5.ngrok-free.app/api/crear_maestros/', {
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
        navigate('/dashboard'); 
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

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Crear Maestro</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre Completo:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Correo:</label>
          <input
            type="correo"
            id="correo"
            value={correo}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">Contraseña:</label>
          <input
            type="contrasena"
            id="contrasena"
            value={contrasena}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="confirmcontrasena" className="block text-sm font-medium text-gray-700">Confirmar Contraseña:</label>
          <input
            type="contrasena"
            id="confirmcontrasena"
            value={confirmcontrasena}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}  
        >
          {loading ? 'Creando...' : 'Crear Maestro'}
        </button>
      </form>
    </div>
  );
}

export default CreateTeacherForm;
