import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import buitre from '../assets/buitre_tangram.png';
import caballo from '../assets/caballo_tangram.png';
import canguro from '../assets/canguro_tangram.png';
import cisne from '../assets/cisne_tangram.png';
import conejo from '../assets/conejo_tangram.png';
import delfin from '../assets/delfin_tangram.png';
import garza from '../assets/garza_tangram.png';
import gato from '../assets/gato_tangram.png';
import jirafa from '../assets/jirafa_tangram.png';
import mariposa from '../assets/mariposa_tangram.png';
import perro from '../assets/perro_tangram.png';
import pez from '../assets/pez_tangram.png';
import casa from '../assets/casa_tangram.png';
import Swal from 'sweetalert2';

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
  const [formError, setFormError] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [actividadAEditar, setActividadAEditar] = useState(null);
const [errorImagenes, setErrorImagenes] = useState('');

  const abrirModalEditar = (actividad) => {
    setActividadAEditar({ ...actividad });
    setShowEditModal(true);
  };

  const cerrarModalEditar = () => {
    setActividadAEditar(null);
    setShowEditModal(false);
  };

  const [showVerModal, setShowVerModal] = useState(false);
  const [actividadAVer, setActividadAVer] = useState(null);

  const bancoTangrams = [
    buitre,
    caballo,
    canguro,
    cisne,
    conejo,
    delfin,
    garza,
    gato,
    jirafa,
    mariposa,
    perro,
    pez,
    casa,
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
        console.log('Salones recibidos:', data);  // Asegúrate de que los datos están llegando aquí
        
        if (data && Array.isArray(data)) {
          setSalones(data);
        } else {
          console.error('Los datos no están en el formato esperado:', data);
        }
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

  // Validaciones
  const { nombre, horas, minutos, segundos, imagenes } = newActivity;

  const tiempoTotal = parseInt(horas) + parseInt(minutos) + parseInt(segundos);

  if (!nombre.trim()) {
    setFormError('Todos los campos son obligatorios.');
    setTimeout(() => setFormError(''), 3000);
    return;
  }

  if (tiempoTotal === 0) {
    setFormError('El tiempo debe ser mayor a 00:00:00.');
    setTimeout(() => setFormError(''), 3000);
    return;
  }

  if (!imagenes || imagenes.length < 2) {
    setFormError('Debes seleccionar al menos 2 imágenes.');
    setTimeout(() => setFormError(''), 3000);
    return;
  }

  // Validación pasada — limpieza del error
  setFormError('');

  const horasVal = Math.max(0, Math.floor(horas));
  const minutosVal = Math.max(0, Math.floor(minutos));
  const segundosVal = Math.max(0, Math.floor(segundos));

  console.log('Datos de la actividad a enviar:', {
    nombre,
    horas: horasVal,
    minutos: minutosVal,
    segundos: segundosVal,
    imagenes,
    salones: [],
    maestroId: teacherId,
    activo: false,
  });

  const nuevaActividad = {
    nombre,
    horas: horasVal,
    minutos: minutosVal,
    segundos: segundosVal,
    banco_tangrams: imagenes || [],
    salon: (newActivity.salones && newActivity.salones.length > 0) ? newActivity.salones[0] : null,
    maestroId: teacherId,
    activo: false
  };

  console.log('datos enviando si o si', nuevaActividad);
  console.log('Datos que estamos enviando:', nuevaActividad);
  console.log('Tipo de datos:', typeof nuevaActividad);
  console.log('Tipo de las imágenes:', Array.isArray(imagenes) ? 'Array' : 'No es un array');
  console.log('Tipo de las horas:', typeof nuevaActividad.horas);
  console.log('Tipo de los minutos:', typeof nuevaActividad.minutos);
  console.log('Tipo de los segundos:', typeof nuevaActividad.segundos);
  console.log('Tipo del nombre:', typeof nuevaActividad.nombre);
  console.log('Tipo del estado: ', typeof nuevaActividad.activo);

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


 const handleEliminarActividad = async (id) => {
  const confirmDelete = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará la actividad permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  });

  if (!confirmDelete.isConfirmed) return;

  try {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      console.error('No se encontró el token de acceso.');
      await Swal.fire({
        icon: 'error',
        title: 'Sin sesión',
        text: 'No se encontró el token de acceso. Inicia sesión nuevamente.',
      });
      return;
    }

    const response = await fetch(`http://127.0.0.1:8000/actividades/api/eliminar_actividad/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar actividad: ${response.statusText}`);
    }

    // ✅ Actualiza el estado eliminando la actividad
    setActividades(prev => prev.filter(actividad => actividad.id !== id));

    await Swal.fire({
      icon: 'success',
      title: 'Actividad eliminada',
      text: 'La actividad fue eliminada exitosamente.',
      timer: 2000,
      showConfirmButton: false
    });

  } catch (error) {
    console.error('Error al eliminar la actividad:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo eliminar la actividad.',
    });
  }
};

const handleEditarActividad = async (actividad) => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      console.error('No se encontró el token de acceso.');
      await Swal.fire({
        icon: 'error',
        title: 'Sin sesión',
        text: 'No se encontró el token de acceso. Inicia sesión de nuevo.',
      });
      return;
    }

    const response = await fetch(`http://127.0.0.1:8000/actividades/api/editar_actividad/${actividad.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        nombre: actividad.nombre,
        horas: actividad.horas,
        minutos: actividad.minutos,
        segundos: actividad.segundos,
        banco_tangrams: actividad.banco_tangrams,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Actividad editada con éxito:", data);
      await Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Actividad actualizada correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
            await fetchActividades();

    } else {
      console.error("❌ Error al editar:", data);
      await Swal.fire({
        icon: 'error',
        title: 'Error al editar',
        text: data.error || 'Ocurrió un error al editar la actividad.',
      });
    }
  } catch (err) {
    console.error("❌ Error de red:", err);
    await Swal.fire({
      icon: 'error',
      title: 'Error de red',
      text: 'No se pudo conectar con el servidor.',
    });
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
  
  const handleAssignActivityToClass = async () => {
    const actividadId = actividades.find(actividad => actividad.id === selectedActivityId)?.id;
  
    if (!actividadId) {
      console.error('No se encontró la actividad con el ID proporcionado');
      return;
    }
  
    const salonId = selectedSalones[0];  
  
    try {
      // Haciendo la llamada POST a la API
      const response = await fetch('http://127.0.0.1:8000/actividades/api/asignar_salon_actividad/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actividad_id: actividadId,
          salon_id: salonId
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Respuesta:', data.success);
        await fetchActividades();
        setShowAssignModal(false)
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error al asignar actividad:', error);
    }
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

  //HANDLE PARA ACTIVAR ACTIVIDAD 
  const handleToggleActivo = async (id, currentState) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
  
      const response = await fetch(`http://127.0.0.1:8000/actividades/api/activar_actividad/${id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activo: !currentState }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(data.error || 'Error al actualizar el estado');
        return;
      }
  
      // Actualiza el estado local manualmente
      setActividades((prev) =>
        prev.map((actividad) => {
          // Desactiva las otras con el mismo salón si esta fue activada
          if (actividad.id !== id && actividad.salon?.id === data.salon_id) {
            return { ...actividad, activo: false };
          }
  
          // Esta es la que acabamos de activar/desactivar
          if (actividad.id === id) {
            return { ...actividad, activo: data.activo };
          }
  
          return actividad;
        })
      );
  
    } catch (error) {
      console.error('Error al actualizar la actividad:', error);
    }
  };

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

  useEffect(() => {
    fetchActividades();
  }, []);
  

  return (
        <div className="min-h-screen bg-gray-100 flex">
          <Navbar />
          <div className="flex-1 p-6 ml-60">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Panel de Actividades</h1>
              <button 
              onClick={() => navigate('/dashboard')}             className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <FaArrowLeft className="mr-2" /> Volver
              </button>
              </div>

            <button onClick={() => setShowForm(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition-all duration-300 mb-4">
              + Crear Actividad
            </button>
            
            {showForm && (
              <>
              {formError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-md shadow-sm text-sm">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mb-4 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <label className="block mb-4 font-semibold text-gray-700">
                  Nombre de la Actividad: <span className="text-red-500">*</span>
                  <input
                    type="text"
                    value={newActivity.nombre}
                    onChange={(e) => setNewActivity({ ...newActivity, nombre: e.target.value })}
                    className="border border-gray-300 mt-2 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </label>

                <label className="block mb-4 font-semibold text-gray-700">
                  Tiempo de la Actividad: <span className="text-red-500">*</span>
                  <div className="flex gap-3 mt-2">
                      <div className="flex flex-col items-center">
                        <input
                          type="number"
                          min="0"
                          max="24"
                          value={newActivity.horas}
                          onChange={(e) => {
                            let val = e.target.value.slice(0, 2); // Máximo 2 dígitos
                            val = parseInt(val);
                            setNewActivity({ ...newActivity, horas: isNaN(val) ? 0 : val });
                          }}
                          className="border border-gray-300 p-2 w-16 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                          placeholder="hh"
                          required
                        />
                        <span className="text-xs text-gray-500 mt-1">hh</span>
                      </div>
                    <span className="text-lg mt-2">:</span>
                      <div className="flex flex-col items-center">
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={newActivity.minutos}
                          onChange={(e) => {
                            let val = e.target.value.slice(0, 2);
                            val = parseInt(val);
                            setNewActivity({ ...newActivity, minutos: isNaN(val) ? 0 : val });
                          }}
                          className="border border-gray-300 p-2 w-16 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                          placeholder="mm"
                          required
                        />
                        <span className="text-xs text-gray-500 mt-1">mm</span>
                      </div>
                    <span className="text-lg mt-2">:</span>
                          <div className="flex flex-col items-center">
                            <input
                              type="number"
                              min="0"
                              max="59"
                              value={newActivity.segundos}
                              onChange={(e) => {
                                let val = e.target.value.slice(0, 2);
                                val = parseInt(val);
                                setNewActivity({ ...newActivity, segundos: isNaN(val) ? 0 : val });
                              }}
                              className="border border-gray-300 p-2 w-16 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                              placeholder="ss"
                              required
                            />
                            <span className="text-xs text-gray-500 mt-1">ss</span>
                          </div>
                  </div>
                </label>

                <div className="mt-6">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Selecciona imágenes: <span className="text-red-500">*</span>
                  </h3>
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={goToPreviousPage}
                      disabled={currentIndex === 0}
                      className="bg-gray-500 text-white py-2 px-3 rounded-full hover:bg-gray-600"
                    >
                      <FaArrowLeft />
                    </button>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mx-4">
                      {bancoTangrams.slice(currentIndex, currentIndex + imagesPerPage).map((imagen, index) => (
                        <div
                          key={index}
                          onClick={() => handleImageSelect(imagen)}
                          className={`cursor-pointer border-2 rounded-md overflow-hidden ${
                            newActivity.imagenes.includes(imagen) ? 'border-blue-500' : 'border-gray-300'
                          }`}
                        >
                          <img src={imagen} alt={`Tangram ${index + 1}`} className="w-full h-20 object-cover" />
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={goToNextPage}
                      disabled={currentIndex + imagesPerPage >= bancoTangrams.length}
                      className="bg-gray-500 text-white py-2 px-3 rounded-full hover:bg-gray-600"
                    >
                      <FaArrowRight />
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-md">
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-5 rounded-md"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
               </>
            )}


<div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
  <table className="w-full">
    <thead>
      <tr className="bg-gray-200 text-gray-700 text-sm uppercase tracking-wider">
        <th className="p-3 border-r last:border-r-0">Nombre</th>
        <th className="p-3 border-r last:border-r-0">Tiempo</th>
        <th className="p-3 border-r last:border-r-0">Grupo</th>
        <th className="p-3 border-r last:border-r-0">Estado</th>
        <th className="p-3">Acciones</th>
      </tr>
    </thead>
    <tbody>
      {actividades.length > 0 ? (
        actividades.map((actividad) => (
          <tr key={actividad.id} className="text-center border-b hover:bg-gray-50 transition">
            <td className="p-4 text-sm text-gray-800 border-r last:border-r-0">{actividad.nombre}</td>
            <td className="p-4 text-sm text-gray-800 border-r last:border-r-0">
              {`${String(actividad.horas).padStart(2, '0')}:${String(actividad.minutos).padStart(2, '0')}:${String(actividad.segundos).padStart(2, '0')}`}
            </td>
            <td className="p-4 text-sm text-gray-800 border-r last:border-r-0">
{actividad.salon &&
 actividad.salon.grado !== null &&
 actividad.salon.grupo !== null &&
 actividad.salon.ciclo_escolar_inicio !== null &&
 actividad.salon.ciclo_escolar_fin !== null
  ? `${actividad.salon.grado}º ${actividad.salon.grupo} (${actividad.salon.ciclo_escolar_inicio}-${actividad.salon.ciclo_escolar_fin})`
  : 'Sin asignar'}

            </td>
            <td className="p-4 border-r last:border-r-0">
              <label
                className={`inline-flex items-center ${!actividad.salon?.id ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                title={!actividad.salon?.id ? "Debes asignar un salón antes de activar esta actividad." : ""}
              >
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={actividad.activo}
                  onChange={() => handleToggleActivo(actividad.id, actividad.activo)}
                  disabled={!actividad.salon?.id}
                />
                <div className={`relative w-11 h-6 rounded-full transition-all
                  ${!actividad.salon?.id ? 'bg-gray-200 opacity-50' : 'bg-gray-200'}
                  peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700
                  peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600
                  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                  peer-checked:after:border-white
                  after:content-[''] after:absolute after:top-0.5 after:start-[2px]
                  after:bg-white after:border-gray-300 after:border after:rounded-full
                  after:h-5 after:w-5 after:transition-all dark:border-gray-600`}>
                </div>
              </label>
            </td>
            <td className="p-4">
              <button
                onClick={() => {
                  setActividadAVer(actividad);
                  setShowVerModal(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-sm mx-1 transition-all duration-300"
              >
                Ver
              </button>
              <button
                onClick={() => abrirModalEditar(actividad)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-lg text-sm mx-1 transition-all duration-300"
              >
                Editar
              </button>
              <button
                onClick={() => handleEliminarActividad(actividad.id)}
                className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded-lg text-sm mx-1 transition-all duration-300"
              >
                Eliminar
              </button>
              <button
                onClick={() => handleAssignToClass(actividad.id)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-sm mx-1 transition-all duration-300"
              >
                Asignar a
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5" className="px-4 py-6 text-center text-gray-500 text-sm">
            No hay actividades disponibles
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


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
                      {`${salon.grado}-${salon.grupo}`}  {/* Aquí es donde combinamos grado y grupo */}
                    </option>
                  ))
                ) : (
                  <option disabled>No hay salones disponibles</option>
                )}
              </select>

            </div>
            <div className="mt-4">
  <button
  onClick={() => setShowAssignModal(false)}
  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300"
>
  Cancelar
</button>

<button
  onClick={handleAssignActivityToClass}
  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ml-2"
>
  Asignar
</button>

            </div>
          </div>
        </div>
      )}

      {showEditModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h2 className="text-xl font-bold mb-4">Editar Actividad</h2>

      <label className="block mb-2">
        Nombre:
        <input
          type="text"
          value={actividadAEditar?.nombre || ""}
          onChange={(e) => setActividadAEditar({ ...actividadAEditar, nombre: e.target.value })}
          className="border p-2 w-full rounded-md"
        />
      </label>

      <div className="flex gap-2 mb-4">
        <span className="text-sm text-gray-600 mt-1">hh</span>

              <input
          type="number"
          placeholder="Horas"
          min="0"
          max="24"
          value={actividadAEditar?.horas || 0}
          onChange={(e) => {
            let val = e.target.value.slice(0, 2); // máximo 2 caracteres
            val = parseInt(val);
            setActividadAEditar({ ...actividadAEditar, horas: isNaN(val) ? 0 : val });
          }}
          className="border p-2 rounded-md w-1/3"
        />

        <span className="text-sm text-gray-600 mt-1">mm</span>

          <input
            type="number"
            placeholder="Min"
            min="0"
            max="59"
            value={actividadAEditar?.minutos || 0}
            onChange={(e) => {
              let val = e.target.value.slice(0, 2);
              val = parseInt(val);
              setActividadAEditar({ ...actividadAEditar, minutos: isNaN(val) ? 0 : val });
            }}
            className="border p-2 rounded-md w-1/3"
          />
        <span className="text-sm text-gray-600 mt-1">ss</span>
          <input
            type="number"
            placeholder="Seg"
            min="0"
            max="59"
            value={actividadAEditar?.segundos || 0}
            onChange={(e) => {
              let val = e.target.value.slice(0, 2);
              val = parseInt(val);
              setActividadAEditar({ ...actividadAEditar, segundos: isNaN(val) ? 0 : val });
            }}
            className="border p-2 rounded-md w-1/3"
          />
      </div>

      <div className="mb-4">
        {errorImagenes && (
  <p className="text-red-500 text-sm mt-2">{errorImagenes}</p>
)}

        <p className="font-semibold mb-2">Imágenes:</p>
        <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
          {bancoTangrams.map((imagen, index) => (
            <div
              key={index}
              onClick={() => {
                const nuevas = actividadAEditar?.banco_tangrams?.includes(imagen)
                  ? actividadAEditar.banco_tangrams.filter(img => img !== imagen)
                  : [...(actividadAEditar?.banco_tangrams || []), imagen];
                setActividadAEditar({ ...actividadAEditar, banco_tangrams: nuevas });
              }}
              className={`cursor-pointer border-2 ${actividadAEditar?.banco_tangrams?.includes(imagen) ? "border-blue-500" : "border-gray-300"}`}
            >
              <img src={imagen} alt={`Tangram ${index}`} className="w-full h-auto" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
  onClick={cerrarModalEditar}
  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 mr-2"
>
  Cancelar
</button>

<button
  onClick={async () => {
    const { horas, minutos, segundos, banco_tangrams } = actividadAEditar || {};
    const totalTiempo = (horas || 0) + (minutos || 0) + (segundos || 0);

    if ((banco_tangrams?.length || 0) < 2) {
      setErrorImagenes("Debes seleccionar al menos 2 imágenes para guardar la actividad.");
      return;
    }

    if (horas > 24) {
      setErrorImagenes("Las horas no pueden ser mayores a 24.");
      return;
    }

    if (minutos > 59 || segundos > 59) {
      setErrorImagenes("Los minutos y segundos no pueden ser mayores a 59.");
      return;
    }

    if (totalTiempo === 0) {
      setErrorImagenes("El tiempo total no puede ser 00:00:00.");
      return;
    }

    setErrorImagenes(""); // Limpia errores anteriores
    await handleEditarActividad(actividadAEditar, fetchActividades);
    cerrarModalEditar();
  }}
  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
>
  Actualizar
</button>


      </div>
    </div>
  </div>
)}

{showVerModal && actividadAVer && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h2 className="text-xl font-bold mb-4 text-center">Detalles de la Actividad</h2>

      <p><strong>Nombre:</strong> {actividadAVer.nombre}</p>
      <p><strong>Tiempo:</strong> {`${String(actividadAVer.horas).padStart(2, '0')}:${String(actividadAVer.minutos).padStart(2, '0')}:${String(actividadAVer.segundos).padStart(2, '0')}`}</p>
      <p><strong>Salón:</strong> {actividadAVer.salon ? `${actividadAVer.salon.grado} - ${actividadAVer.salon.grupo}` : 'No asignado'}</p>
      <p><strong>Estado:</strong> {actividadAVer.activo ? 'Activa' : 'Inactiva'}</p>

      <div className="mt-4">
        <strong>Imágenes seleccionadas:</strong>
        <div className="grid grid-cols-3 gap-2 mt-2 max-h-40 overflow-y-auto">
          {(actividadAVer.banco_tangrams || []).map((img, i) => (
            <img key={i} src={img} alt={`img-${i}`} className="w-full rounded border" />
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
  <button
  onClick={() => setShowVerModal(false)}
  className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
>
  Cerrar
</button>

      </div>
    </div>
  </div>
)}


      </div>
    </div>
  );
};

export default ActivitiesPanel;