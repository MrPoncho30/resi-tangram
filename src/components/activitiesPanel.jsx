import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ActivitiesPanel = () => {
  const navigate = useNavigate();
  const teacherId = parseInt(localStorage.getItem("maestro")) || null;

  const [actividades, setActividades] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newActivity, setNewActivity] = useState({ nombre: '', horas: 0, minutos: 0, segundos: 0, imagenes: [] });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [salones, setSalones] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const imagesPerPage = 4;

  const bancoTangrams = [
    require('../assets/ALAN.png'),
    require('../assets/casa_tangram.png'),
    require('../assets/latuyacrack.png'),
    require('../assets/logo_tan.png'),
    require('../assets/ALAN.png'),
    require('../assets/ALAN.png')
  ];
  

  useEffect(() => {
    const fetchSalones = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
          console.error('No se encontró el token de acceso.');
          return; 
        }

        const response = await fetch('http://127.0.0.1:8000/salones/api/listar_salon/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setSalones(data); 
      } catch (error) {
        console.error('Error al cargar los salones:', error);
      }
    };

    fetchSalones(); 
  }, []);

  const handleEliminar = (id) => {
    setActividades(actividades.filter(actividad => actividad.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const tiempoFormato = `${String(newActivity.horas).padStart(2, '0')}:${String(newActivity.minutos).padStart(2, '0')}:${String(newActivity.segundos).padStart(2, '0')}`;
    
  const horas = Math.max(0, Math.floor(newActivity.horas));
  const minutos = Math.max(0, Math.floor(newActivity.minutos));
  const segundos = Math.max(0, Math.floor(newActivity.segundos));

  console.log('Datos de la actividad a enviar:', {
    nombre: newActivity.nombre,
    horas: horas,      
    minutos: minutos,   
    segundos: segundos, 
    imagenes: newActivity.imagenes,
    // fecha: new Date().toISOString().split('T')[0], // Fecha en formato YYYY-MM-DD
    salones: [],
    maestroId: teacherId,
  });

  const nuevaActividad = {
    nombre: newActivity.nombre,
    horas: horas,       
    minutos: minutos,   
    segundos: segundos, 
    banco_tangrams: newActivity.imagenes || [], 
    salon: (newActivity.salones && newActivity.salones.length > 0) ? newActivity.salones[0] : null, 
    maestroId: teacherId,
  };
  

console.log('datos enviando si o si', (nuevaActividad))
  // Aquí agregamos el console.log para verificar los datos
  console.log('Datos que estamos enviando:', nuevaActividad);
  console.log('Tipo de datos:', typeof nuevaActividad);
  console.log('Tipo de las imágenes:', Array.isArray(newActivity.imagenes) ? 'Array' : 'No es un array');
  console.log('Tipo de las horas:', typeof nuevaActividad.horas);
  console.log('Tipo de los minutos:', typeof nuevaActividad.minutos);
  console.log('Tipo de los segundos:', typeof nuevaActividad.segundos);
  console.log('Tipo del nombre:', typeof nuevaActividad.nombre);

    try {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        console.error('No se encontró el token de acceso.');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/actividades/api/crear_actividad/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaActividad),
      });

      if (!response.ok) {
        throw new Error(`Error al crear la actividad: ${response.statusText}`);
      }

      const data = await response.json();
      setActividades([...actividades, data]);

      setShowForm(false);
      setNewActivity({ nombre: '', horas: 0, minutos: 0, segundos: 0, imagenes: [] });
    } catch (error) {
      console.error('Error al crear la actividad:', error);
    }
  };

  const handleImageSelect = (imagen) => {
    setNewActivity(prev => ({
      ...prev,
      imagenes: prev.imagenes.includes(imagen)
        ? prev.imagenes.filter(img => img !== imagen)
        : [...prev.imagenes, imagen]
    }));
  };

  const handleAssignToClass = (activityId) => {
    setSelectedActivityId(activityId);
    setShowAssignModal(true);
  };

  const [selectedSalones, setSelectedSalones] = useState([]);

  const handleSalonSelection = (e) => {
    const { value, checked } = e.target;
    setSelectedSalones(prevSelectedSalones =>
      checked ? [...prevSelectedSalones, value] : prevSelectedSalones.filter(id => id !== value)
    );
  };
  
  const handleAssignActivityToClass = () => {
    const updatedActivities = actividades.map(actividad =>
      actividad.id === selectedActivityId
        ? { ...actividad, salones: [...actividad.salones, ...selectedSalones] }
        : actividad
    );
    setActividades(updatedActivities);
    setShowAssignModal(false);
  };

  const goToNextPage = () => {
    if (currentIndex + imagesPerPage < bancoTangrams.length) {
      setCurrentIndex(currentIndex + imagesPerPage);
    }
  };

  const goToPreviousPage = () => {
    if (currentIndex - imagesPerPage >= 0) {
      setCurrentIndex(currentIndex - imagesPerPage);
    }
  };


  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
  
        if (!accessToken) {
          console.error('No se encontró el token de acceso.');
          return;
        }
  
        const response = await fetch('http://127.0.0.1:8000/actividades/api/listar_actividad/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error al obtener actividades: ${response.statusText}`);
        }
  
        const data = await response.json();
        setActividades(data); 
      } catch (error) {
        console.error('Error al obtener actividades:', error);
      }
    };
  
    fetchActividades();
  }, []);
  

  return (
        <div className="min-h-screen bg-gray-100 flex">
          <Navbar />
          <div className="flex-1 p-6">
            <h2 className="text-xl font-semibold mb-4">Panel de Actividades</h2>
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-700 hover:text-gray-900 mb-4">
              <FaArrowLeft className="mr-2" /> Volver
            </button>
            <button onClick={() => setShowForm(true)} className="mb-4 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-800 transition">
              Crear Actividad
            </button>

            {showForm && (
              <form onSubmit={handleSubmit} className="mb-4 bg-white p-4 rounded-lg shadow-md">
                <label className="block mb-2">
                  Nombre de la Actividad:
                  <input type="text" value={newActivity.nombre} onChange={(e) => setNewActivity({ ...newActivity, nombre: e.target.value })} className="border p-2 w-full rounded-md" required />
                </label>
                <label className="block mb-2">
                  Tiempo de la Actividad:
                  <div className="flex gap-2">
                    <input type="number" min="0" value={newActivity.horas} onChange={(e) => setNewActivity({ ...newActivity, horas: parseInt(e.target.value) || 0 })} className="border p-2 w-16 rounded-md" placeholder="hh" required />
                    <span>:</span>
                    <input type="number" min="0" max="59" value={newActivity.minutos} onChange={(e) => setNewActivity({ ...newActivity, minutos: parseInt(e.target.value) || 0 })} className="border p-2 w-16 rounded-md" placeholder="mm" required />
                    <span>:</span>
                    <input type="number" min="0" max="59" value={newActivity.segundos} onChange={(e) => setNewActivity({ ...newActivity, segundos: parseInt(e.target.value) || 0 })} className="border p-2 w-16 rounded-md" placeholder="ss" required />
                  </div>
                </label>

                <div className="mt-4">
                  <h3>Selecciona imágenes:</h3>
                  <div className="flex justify-between items-center mt-4">
                    <button type="button" onClick={goToPreviousPage} disabled={currentIndex === 0} className="bg-gray-500 text-white py-2 px-4 rounded-md"> <FaArrowLeft /> </button>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {bancoTangrams.slice(currentIndex, currentIndex + imagesPerPage).map((imagen, index) => (
                        <div key={index} onClick={() => handleImageSelect(imagen)} className={`cursor-pointer p-2 border ${newActivity.imagenes.includes(imagen) ? 'border-blue-500' : 'border-gray-300'}`}>
                          <img src={imagen} alt={`Tangram ${index + 1}`} className="w-full h-auto" />
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={goToNextPage} disabled={currentIndex + imagesPerPage >= bancoTangrams.length} className="bg-gray-500 text-white py-2 px-4 rounded-md"> <FaArrowRight /> </button>
                  </div>
                </div>

                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2">Guardar</button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 text-white py-2 px-4 rounded-md">Cancelar</button>
              </form>
            )}

            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Nombre</th>
                  <th className="border p-2">Tiempo</th>
                  {/* <th className="border p-2">Fecha de Creación</th> */}
                  <th className="border p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
      {actividades.map((actividad) => (
        
        <tr key={actividad.id} className="text-center">
          <td className="border p-2">{actividad.nombre}</td>
          <td className="border p-2">
      {`${String(actividad.horas).padStart(2, '0')}:${String(actividad.minutos).padStart(2, '0')}:${String(actividad.segundos).padStart(2, '0')}`}
    </td>
          {/* <td className="border p-2">{actividad.fecha_creacion || 'Sin fecha'}</td> */}
          <td className="border p-2">
            <button onClick={() => console.log('Ver actividad', actividad)} className="bg-blue-500 text-white px-2 py-1 rounded-md mx-1 hover:bg-blue-700">Ver</button>
            <button onClick={() => console.log('Editar actividad', actividad)} className="bg-yellow-500 text-white px-2 py-1 rounded-md mx-1 hover:bg-yellow-700">Editar</button>
            <button onClick={() => handleEliminar(actividad.id)} className="bg-red-500 text-white px-2 py-1 rounded-md mx-1 hover:bg-red-700">Eliminar</button>
            <button onClick={() => handleAssignToClass(actividad.id)} className="bg-green-500 text-white px-2 py-1 rounded-md mx-1 hover:bg-green-700">Asignar a</button>
          </td>
        </tr>
      ))}
    </tbody>

        </table>

       {/* Modal Asignar a */}
        {showAssignModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h3 className="text-xl mb-4">Asignar Actividad</h3>
              <div>
                <h4 className="mb-2">Selecciona un salón:</h4>
                <select 
                  value={selectedSalones[0] || ''} 
                  onChange={(e) => setSelectedSalones([e.target.value])} 
                  className="border p-2 w-full rounded-md"
                >
                  <option value="" disabled>Selecciona un salón</option>
                  {salones.length > 0 ? (
                    salones.map(salon => (
                      <option key={salon.id} value={salon.id}>
                        {salon.nombre}
                      </option>
                    ))
                  ) : (
                    <option disabled>No hay salones disponibles</option>
                  )}
                </select>
              </div>
              <div className="mt-4">
                <button onClick={() => setShowAssignModal(false)} className="bg-gray-500 text-white py-2 px-4 rounded-md">Cancelar</button>
                <button onClick={handleAssignActivityToClass} className="bg-blue-500 text-white py-2 px-4 rounded-md">Asignar</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ActivitiesPanel;
