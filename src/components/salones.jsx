
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { FaArrowLeft } from 'react-icons/fa';

// URLs de las APIs
const API_GET_SALONES_URL = 'http://127.0.0.1:8000/salones/api/listar_salon/';  
const API_CREATE_SALON_URL = 'http://127.0.0.1:8000/salones/api/crear_salones/';  

const Salones = () => {
  const navigate = useNavigate();
  const [salones, setSalones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    grado: '',
    grupo: '',
    ciclo_escolar_inicio: new Date().getFullYear(),
    ciclo_escolar_fin: new Date().getFullYear() + 1,
  });

  // Cargar salones desde la API
  useEffect(() => {
    fetchSalones();
  }, []);

  const teacherId = localStorage.getItem("maestro");
console.log("ID del maestro desde localStorage:", teacherId);


const fetchSalones = async () => {
  try { 
    const accessToken = localStorage.getItem('accessToken'); // O donde lo estés guardando
    console.log(accessToken)

    const response = await fetch(API_GET_SALONES_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,  // Aquí envías el token
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('JSON data:', data);
    setSalones(data)

  } catch (error) {
    console.error('Error al cargar los salones:', error);
  }
};


  

  // Registrar un nuevo salón usando la API
  const handleRegisterSalon = async () => {
    const teacherId = localStorage.getItem("maestro");
  
    if (!teacherId) {
      console.error("Error: No se encontró el ID del maestro en localStorage");
      return;
    }
  
    const salonData = {
      grado: parseInt(formData.grado),
      grupo: formData.grupo,
      ciclo_escolar_inicio: parseInt(formData.ciclo_escolar_inicio),
      ciclo_escolar_fin: parseInt(formData.ciclo_escolar_fin),
      docente: parseInt(teacherId),
    };
  
    try {
      const accessToken = localStorage.getItem('accessToken'); 
      const response = await fetch(API_CREATE_SALON_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,  // Aquí envías el token
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(salonData),
      });
  
      // Agregar el console.log para ver la respuesta de la API
      const responseData = await response.json();
      console.log('Respuesta de la API crear:', responseData);
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al registrar salón: ${errorText}`);
      }
  
      fetchSalones();
      setShowModal(false);  // Cerrar modal
      setFormData({
        grado: '',
        grupo: '',
        ciclo_escolar_inicio: new Date().getFullYear(),
        ciclo_escolar_fin: new Date().getFullYear() + 1,
      });
    } catch (error) {
      console.error('Error registrando salón:', error);
    }
  };
  
  // Eliminar salón
  const handleDeleteSalon = async (salonId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este salón?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_GET_SALONES_URL}/${salonId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al eliminar salón: ${errorText}`);
      }

      fetchSalones();
    } catch (error) {
      console.error('Error eliminando salón:', error);
    }
  };

  // Mostrar tabla de salones
  const renderTable = () => (
    <table className="w-full bg-white rounded-lg shadow-md">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left">Grado</th>
          <th className="px-4 py-2 text-left">Grupo</th>
          <th className="px-4 py-2 text-left">Ciclo Escolar</th>
          <th className="px-4 py-2 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {salones.length > 0 ? (
          salones.map((salon) => (
            <tr key={salon.id}>
              <td className="px-4 py-2">{salon.grado}</td>
              <td className="px-4 py-2">{salon.grupo}</td>
              <td className="px-4 py-2">
                {salon.ciclo_escolar_inicio} - {salon.ciclo_escolar_fin}
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => navigate(`/salon/${salon.id}/alumnos`)}
                  className="py-1 px-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Ver Alumnos
                </button>
                <button
                  onClick={() => handleDeleteSalon(salon.id)}
                  className="ml-2 py-1 px-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="px-4 py-2 text-center text-gray-500">
              No hay salones disponibles
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
  

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Navbar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Salones</h1>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-gray-900 mb-4"
        >
          <FaArrowLeft className="mr-2" /> Volver
        </button>

        <button
          onClick={() => setShowModal(true)}
          className="mb-6 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Registrar Salón
        </button>

        <div className="overflow-x-auto">
          {renderTable()}
        </div>
      </div>

      {/* Modal de Registro */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Registrar Salón</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Grado</label>
                <select
                  value={formData.grado}
                  onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Seleccione un grado</option>
                  {[1, 2, 3, 4, 5, 6].map(grado => (
                    <option key={grado} value={grado}>{grado}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Grupo</label>
                <select
                  value={formData.grupo}
                  onChange={(e) => setFormData({ ...formData, grupo: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Seleccione un grupo</option>
                  {['A', 'B', 'C', 'D'].map(grupo => (
                    <option key={grupo} value={grupo}>{grupo}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Ciclo Escolar Inicio</label>
                <input
                  type="number"
                  value={formData.ciclo_escolar_inicio}
                  onChange={(e) => setFormData({ ...formData, ciclo_escolar_inicio: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Ciclo Escolar Fin</label>
                <input
                  type="number"
                  value={formData.ciclo_escolar_fin}
                  onChange={(e) => setFormData({ ...formData, ciclo_escolar_fin: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleRegisterSalon}
                  className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Registrar
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="ml-2 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Salones;