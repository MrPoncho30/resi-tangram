import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';
import myImage from '../assets/bg-tangram.png'


function CreateTeacherForm() {
  const [nombre, setFullName] = useState('');  
  const [correo, setEmail] = useState('');
  const [contrasena, setPassword] = useState('');
  const [confirmcontrasena, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  
  
  const navigate = useNavigate();
  const [formError, setFormError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  // Validación de campos vacíos
  if (!nombre || !correo || !contrasena) {
    setFormError(true);
    setTimeout(() => setFormError(false), 3000); // Oculta después de 3s
    return;
  }



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

return (
  <div
    className="min-h-screen flex items-center justify-center bg-gray-200"
    style={{
      backgroundImage: `url(${myImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="absolute inset-0 bg-black opacity-50"></div>

    <div className="w-full max-w-md bg-white bg-opacity-95 p-10 rounded-2xl shadow-2xl border border-gray-300 z-20">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Crear Maestro</h2>
      <p className="text-center text-gray-500 mb-6 text-sm">
        Complete el siguiente formulario para registrarse
      </p>

      {formError && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center font-medium">
          Todos los campos son obligatorios.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="nombre" className="text-sm font-medium text-gray-700">Nombre Completo</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nombre completo"
            required
            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-400"
          />
        </div>

        <div>
          <label htmlFor="correo" className="text-sm font-medium text-gray-700">Correo Institucional</label>
          <input
            type="email"
            id="correo"
            value={correo}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@escuela.edu.mx"
            required
            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-400"
          />
        </div>

        <div>
          <label htmlFor="contrasena" className="text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            id="contrasena"
            value={contrasena}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
            required
            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-400"
          />
        </div>

        <div>
          <label htmlFor="confirmcontrasena" className="text-sm font-medium text-gray-700">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmcontrasena"
            value={confirmcontrasena}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Reingrese la contraseña"
            required
            className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-400"
          />
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
            {loading ? "Creando..." : "Crear Maestro"}
          </button>

          <button
            onClick={handleGoBack}
            className="mt-4 w-full flex justify-center items-center bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-300"
          >
            <FaArrowLeft className="mr-2" /> Volver al Login
          </button>
        </div>
      </form>
    </div>
  </div>
);

  
}

export default CreateTeacherForm;
