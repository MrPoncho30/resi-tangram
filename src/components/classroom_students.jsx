// export default ClassroomStudents;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { FaArrowLeft } from 'react-icons/fa';
import { FaTrash } from "react-icons/fa";
import { useLocation } from 'react-router-dom';


const API_URL_CREATE = "http://127.0.0.1:8000/estudiantes/api/crear_estudiante/";
const API_URL_LIST = "http://127.0.0.1:8000/estudiantes/api/listar_estudiantes/";  // API para obtener los alumnos
const API_URL_DELETE = "http://127.0.0.1:8000/estudiantes/api/eliminar_alumno/alumno_id/";
const API_URL_LIST_EQUIPOS = "http://127.0.0.1:8000/equipos/api/listar_equipos/"; // API para obtener equipos
const API_URL_CREATE_EQUIPO = "http://127.0.0.1:8000/equipos/api/crear_equipo/";
const API_URL_ASSIGN_ALUMNOS = "http://127.0.0.1:8000/estudiantes/api/agregar_equipo_estudiante/";
const API_URL_DELETE_EQUIPO = "http://127.0.0.1:8000/equipos/api/eliminar_equipo/";
const API_URL_MEMBERS_TEAM = "http://127.0.0.1:8000/equipos/api/estudiantes_por_equipo/"


const ClassroomStudents = () => {
  const teacherId = parseInt(localStorage.getItem("maestro")) || null;
  const { id } = useParams();  // El id del salón
  const navigate = useNavigate();
  const [alumnos, setAlumnos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEquipoModal, setShowEquipoModal] = useState(false); // Modal para crear equipo
  const [showRegistrarModal, setShowRegistrarModal] = useState(false);
  const [showAsignarModal, setShowAsignarModal] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    nickname: '',
    salon_id: id,  // El id del salón obtenido de la URL
    equipo: null,  // El campo equipo se establece en null
  });
  const [formEquipoData, setFormEquipoData] = useState({ nombre_equipo: '', salon_id: id, maestro: teacherId }); // Datos para crear equipo
  const [editingAlumno, setEditingAlumno] = useState(null);
  const [selectedAlumnos, setSelectedAlumnos] = useState([]);
  const [selectedEquipoId, setSelectedEquipoId] = useState(null);
  const [showViewEquipoModal, setShowViewEquipoModal] = useState(false); // Modal exclusivo para "Ver equipo"
  const [alumnosEquipo, setAlumnosEquipo] = useState([]); // Esta es la lista de alumnos solo para el modal
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const location = useLocation();
  const { grado, grupo } = location.state || {};
  
  const [showEditarNombreModal, setShowEditarNombreModal] = useState(false);
  const [nuevoNombreEquipo, setNuevoNombreEquipo] = useState('');
  const [equipoIdParaEditar, setEquipoIdParaEditar] = useState(null);

  const [showEditarModal, setShowEditarModal] = useState(false);


  // Función para abrir el modal de "Ver equipo" y obtener los alumnos
  const handleOpenViewEquipoModal = async (equipoId) => {
    setShowViewEquipoModal(true);
    setSelectedEquipoId(equipoId);
    setLoading(true);
    setError("");
  
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No se encontró el token de acceso.');
        return;
      }
  
      const response = await fetch(`${API_URL_MEMBERS_TEAM}${equipoId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error("Error al obtener los estudiantes");
      }
  
      const data = await response.json();
  
      // Si no hay estudiantes, mostrar mensaje sin estudiantes
      if (data.length === 0) {
        setAlumnosEquipo([]); // Si no hay estudiantes en el equipo, lista vacía
      } else {
        setAlumnosEquipo(data); // Establecer los estudiantes del equipo
      }
    } catch (err) {
      setError("Error al cargar los estudiantes.");
    } finally {
      setLoading(false);
    }
  };
  

const handleEliminarEstudiante = async (id) => {
  const confirmar = window.confirm("¿Estás seguro de que deseas eliminar a este estudiante del equipo?");
  if (!confirmar) return;

  try {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(`http://127.0.0.1:8000/estudiantes/api/remover_estudiante_equipo/${id}/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("No se pudo eliminar al estudiante.");
    }

    const data = await response.json();
    alert(data.mensaje);

    // 🔄 Actualizar la lista general de alumnos
    setAlumnos(prev => prev.map(al => 
      al.id === id ? { ...al, equipo: null } : al
    ));

    // 🔄 Actualizar los alumnos dentro del modal de equipo si está abierto
    setAlumnosEquipo(prev => prev.filter(est => est.id !== id));

    // 🔄 (Opcional) Actualizar equipos si manejas estado de `equipos` con estudiantes anidados
    setEquipos(prev => 
      prev.map(eq => ({
        ...eq,
        estudiantes: Array.isArray(eq.estudiantes)
          ? eq.estudiantes.filter(est => est.id !== id)
          : [],
      }))
    );

  } catch (error) {
    console.error("❌ Error al eliminar estudiante:", error);
    alert("Ocurrió un error al eliminar al estudiante.");
  }
};




  const handleCloseViewEquipoModal = () => {
    setShowViewEquipoModal(false);
    setSelectedEquipoId(null);
    setAlumnosEquipo([]); // Limpiar los estudiantes del modal
  };
  
    
    // Función para obtener los alumnos desde la API
  const fetchAlumnos = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        console.error('No se encontró el token de acceso.');
        return;
      }

      const response = await fetch(`${API_URL_LIST}?salon_id=${id}`, {
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
      setAlumnos(data);  // Asignamos los datos obtenidos a los alumnos
    } catch (error) {
      console.error('Error al cargar los alumnos:', error);
    }
  };

  // Función para obtener los equipos desde la API
  const fetchEquipos = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
  
      if (!accessToken) {
        console.error('No se encontró el token de acceso.');
        return;
      }
  
      if (!id) {
        console.error('No se encontró el ID del salón.');
        return;
      }
  
      const response = await fetch(`${API_URL_LIST_EQUIPOS}?salon_id=${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error al obtener los equipos: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('La respuesta de la API no es un array válido.');
      }

      
      
    // Llamamos a la API de códigos para cada equipo y agregamos la información
    const equiposConCodigos = await Promise.all(data.map(async (equipo) => {
      // Llamada para obtener el código de cada equipo
      const codigoResponse = await fetch(`http://127.0.0.1:8000/equipos/api/obtener_codigos/${equipo.id}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      let codigo = "N/A";  // Valor por defecto si no se encuentra el código

      if (codigoResponse.ok) {
        const codigoData = await codigoResponse.json();
        console.log("Respuesta de la API de códigos: ", codigoData);  // Depuramos la respuesta

        if (Array.isArray(codigoData) && codigoData.length > 0) {
          codigo = codigoData[0].codigo;  // Tomamos el primer código
        }
      } else {
        console.error(`Error al obtener código para el equipo ${equipo.id}`);
      }

      return { ...equipo, codigo };  // Agregamos el código al objeto del equipo
    }));

    setEquipos(equiposConCodigos);  // Guardamos los equipos con los códigos obtenidos
  } catch (error) {
    console.error('Error al cargar los equipos:', error.message);
  }
};

const fetchEquiposConEstado = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("No hay token");
      return;
    }

    const response = await fetch("http://127.0.0.1:8000/equipos/api/lista_equipos_con_sesion/", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    setEquipos(data || []); 
  } catch (error) {
    console.error("Error al cargar equipos con estado:", error.message);
  }
};

  // Obtener alumnos y equipos cuando el componente se monta o el id cambia
  useEffect(() => {
    fetchAlumnos();  // Llamamos a la función para obtener los alumnos
    fetchEquipos();  // Llamamos a la función para obtener los equipos
    fetchEquiposConEstado(); //LLamamos a la funcion para obtener estado de los equipos
  }, [id]);

  
  // Registrar alumno en la API
  const handleRegisterAlumno = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No hay token');
        return;
      }
      console.log('Datos que se envían:', { ...formData });
      const response = await fetch(API_URL_CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
        body: JSON.stringify({ ...formData }),
      });

      if (!response.ok) throw new Error("Error registrando alumno");

      const newAlumno = await response.json();
      setAlumnos([...alumnos, newAlumno]);
      setShowModal(false);
      setFormData({ nombre: '', apellidos: '', nickname: '' });
    } catch (error) {
      console.error("Error registrando alumno:", error);
    }
  };
  
  // Al hacer clic en "Registrar Alumno"
const handleRegistrarAlumnoClick = () => {
  setShowRegistrarModal(true); // Abre el modal de registrar alumno
  setShowAsignarModal(false);  // Cierra el modal de asignar alumnos si está abierto
};

  // Editar alumno
const handleEditAlumno = (alumno) => {
  setEditingAlumno(alumno);
  setFormData({
    nombre: alumno.nombre,
    apellidos: alumno.apellidos,
    nickname: alumno.nickname,
  });
  setShowEditarModal(true); // ← Usa el modal de edición, no el de registro
};


  // Actualizar alumno en la API
const handleUpdateAlumno = async () => {
  if (!editingAlumno) return;

  try {
    const token = localStorage.getItem('accessToken');

    const response = await fetch(
  `http://127.0.0.1:8000/estudiantes/api/editar_estudiante/${editingAlumno.id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          nickname: formData.nickname,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Error actualizando alumno");
    }

    // Actualiza el alumno en la lista sin recargar
    const alumnosActualizados = alumnos.map((alumno) =>
      alumno.id === editingAlumno.id
        ? { ...alumno, nombre: formData.nombre, apellidos: formData.apellidos, nickname: formData.nickname }
        : alumno
    );

    setAlumnos(alumnosActualizados);
    setShowEditarModal(false);
    setEditingAlumno(null);
    setFormData({ nombre: '', apellidos: '', nickname: '', salon_id: id, equipo: null });

    alert(data.mensaje);
  } catch (error) {
    console.error("❌ Error actualizando alumno:", error.message);
    alert("Ocurrió un error al actualizar el alumno.");
  }
};



  // Eliminar alumno
  const handleDeleteAlumno = async (alumnoId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este alumno?');
    if (!confirmDelete) return;

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL_DELETE.replace('alumno_id', alumnoId)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar ALUMNO: ${response.statusText}`);
      }

      // Llamamos a la función para refrescar la lista de alumnos después de la eliminación
      fetchAlumnos();  // Esto vuelve a cargar los alumnos
    } catch (error) {
      console.error('Error eliminando ALUMNO:', error);
    }
  };


  // Crear equipo
  const handleCreateEquipo = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
        const teacherId = localStorage.getItem("maestro");
  console.log("ID del maestro desde localStorage:", teacherId);
      if (!accessToken) {
        console.error('No hay token');
        return;
      }
      console.log('Datos que se envían de equipos:', { ...formEquipoData });
      const response = await fetch(API_URL_CREATE_EQUIPO, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
        body: JSON.stringify({ nombre_equipo: formEquipoData.nombre_equipo, salon_id:id, maestro: teacherId }),
      });

      if (!response.ok) throw new Error("Error creando equipo");

      const newEquipo = await response.json();
      setEquipos([...equipos, newEquipo]);
      setShowEquipoModal(false);
      setFormEquipoData({ nombre_equipo: '' });
    } catch (error) {
      console.error("Error creando equipo:", error);
    }
  };


// Asignar alumnos a un equipo
const handleAsignarAlumnos = async (equipoId) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('No hay token');
      return;
    }

    // Asegúrate de que selectedAlumnos esté correctamente cargado
    if (selectedAlumnos.length === 0) {
      console.log('No hay alumnos seleccionados');
      return;
    }

    const response = await fetch(API_URL_ASSIGN_ALUMNOS, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_equipo: equipoId,
        alumnos: selectedAlumnos,  // Enviar todos los IDs de alumnos seleccionados
      }),
    });

    // Verificar si la respuesta es JSON antes de procesarla
    if (!response.ok) {
      const errorResponse = await response.json();  // Obtener la respuesta en JSON si la petición falló
      throw new Error(errorResponse.error || 'Error al asignar alumnos al equipo');
    }

    // Si todo es correcto, refrescar lista
    const result = await response.json();
    console.log(result); // Para depurar si la respuesta contiene los datos esperados.

    fetchEquipos(); // Refrescar la lista de equipos
    setShowModal(false); // Cerrar el modal
    setSelectedAlumnos([]); // Limpiar los alumnos seleccionados

  } catch (error) {
    console.error('Error asignando alumnos:', error);
    alert(`Error: ${error.message}`);
  }
};


const handleAsignarAlumnosClick = (equipoId) => {
  setSelectedEquipoId(equipoId); // Establece el ID del equipo
  setShowAsignarModal(true);     // Abre el modal de asignar alumnos
  setShowRegistrarModal(false); // Cierra el modal de registrar si está abierto
};

const handleEditarEquipoName = async (equipoId) => {
  if (!nuevoNombreEquipo.trim()) {
    alert("El nombre no puede estar vacío.");
    return;
  }

  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`http://127.0.0.1:8000/equipos/api/editar_nombre_equipo/${equipoId}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre: nuevoNombreEquipo }),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el nombre del equipo");
    }

    const data = await response.json();
    alert(data.mensaje);

    // ✅ Cierra el modal y recarga la lista de equipos si tienes una función para eso
    setShowEditarNombreModal(false);

    // Opcional: recargar lista o actualizar estado local si ya tienes los equipos cargados
    setEquipos(prev =>
      prev.map(eq =>
        eq.id === equipoId ? { ...eq, nombre: nuevoNombreEquipo } : eq
      )
    );
  } catch (error) {
    console.error("❌ Error:", error);
    alert("No se pudo actualizar el nombre del equipo.");
  }
};



const handleCheckboxChange = (id) => {
  const isAlumnoSelected = selectedAlumnos.includes(id);

  if (isAlumnoSelected) {
    // Si el alumno ya está seleccionado, lo deseleccionamos
    setSelectedAlumnos(selectedAlumnos.filter((alumnoId) => alumnoId !== id));
  } else {
    // Si no está seleccionado, lo agregamos al array
    setSelectedAlumnos([...selectedAlumnos, id]);
  }
};

////////////////
const handleDeleteEquipo = async (equipoId) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('No hay token');
      return;
    }

    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este equipo?");
    if (!confirmDelete) return;

    const response = await fetch(`${API_URL_DELETE_EQUIPO}${equipoId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || 'Error al eliminar el equipo');
    }

    alert("Equipo eliminado correctamente");

    // Actualizar la lista de equipos
    setEquipos(equipos.filter(equipo => equipo.id !== equipoId));

  } catch (error) {
    console.error('Error eliminando equipo:', error);
    alert(`Error: ${error.message}`);
  }
};

const handleToggleEstado = async (equipoId) => {
  try {

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('No hay token');
      return;
    }
    // Encontrar el equipo actual en la lista
    const equipoActual = equipos.find(equipo => equipo.id === equipoId);
    if (!equipoActual) return;

    // Alternar el estado
    const nuevoEstado = !equipoActual.activa;

    // Hacer la solicitud PATCH con fetch
    const response = await fetch(`http://127.0.0.1:8000/equipos/api/actualizar_estado_sesion/${equipoId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}`,

      },
      body: JSON.stringify({ activa: nuevoEstado })
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    // Actualizar el estado localmente para reflejar el cambio
    setEquipos(prevEquipos =>
      prevEquipos.map(equipo =>
        equipo.id === equipoId ? { ...equipo, activa: nuevoEstado } : equipo
      )
    );

    console.log('Estado de la sesión actualizado correctamente');
  } catch (error) {
    console.error('Error al actualizar el estado de la sesión:', error.message);
  }
};


const AsignarAlumnosModal = ({ equipoId, showModal, setShowModal, alumnos, handleAsignar, equipos }) => {
  // Filtrar los alumnos que ya tienen un equipo asignado
  const alumnosConEquipo = alumnos.filter(alumno => alumno.equipo !== null);

  const handleSubmit = () => {
    handleAsignar(equipoId);
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Asignar Alumnos</h2>
        <div className="mb-4">
          <h3 className="font-semibold">Selecciona los alumnos para asignar al equipo:</h3>
          <div className="space-y-2">
            {alumnos.map((alumno) => (
              <div key={alumno.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`alumno-${alumno.id}`}
                  onChange={() => handleCheckboxChange(alumno.id)}
                  checked={selectedAlumnos.includes(alumno.id) || alumnosConEquipo.some(a => a.id === alumno.id)} 
                  // disabled={alumnosConEquipo.some(a => a.id === alumno.id)}  // Deshabilita si el alumno ya tiene equipo asignado
                />
                <label 
                  htmlFor={`alumno-${alumno.id}`} 
                  className={`ml-2 ${alumnosConEquipo.some(a => a.id === alumno.id) ? 'text-gray-500' : ''}`}
                >
                  {alumno.nombre} {alumno.apellidos}
                  {alumnosConEquipo.some(a => a.id === alumno.id) && (
                    <span className="text-red-500 ml-2">(Asignado)</span>
                  )}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all duration-300"
          >
            Asignar
          </button>

          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="ml-2 py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-all duration-300"
          >
            Cancelar
          </button>

        </div>
      </div>
    </div>
  );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Navbar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Alumnos del Salón {grado}°{grupo}</h1>

        <button onClick={() => navigate(-1)} className="flex items-center text-gray-700 hover:text-gray-900 mb-4">
          <FaArrowLeft className="mr-2" /> Volver
        </button>

        <div className="flex justify-between mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all duration-300 mr-2"
          >
            Registrar Alumno
          </button>

          <button
            onClick={() => setShowEquipoModal(true)}
            className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-all duration-300"
          >
            Crear Equipo
          </button>

        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-2">Lista de Alumnos</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Nombre(s)</th>
                  <th className="px-4 py-2 text-left">Apellidos(s)</th>
                  <th className="px-4 py-2 text-left">NickName</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {alumnos.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      No hay alumnos registrados
                    </td>
                  </tr>
                ) : (
                  alumnos.map((alumno) => (
                    <tr key={alumno.id}>
                      <td className="px-4 py-2">{alumno.nombre}</td>
                      <td className="px-4 py-2">{alumno.apellidos}</td>
                      <td className="px-4 py-2">{alumno.nickname}</td>
                      <td className="px-4 py-2">
                        <div className="flex justify-start space-x-2">
                          <button
                            onClick={() => handleEditAlumno(alumno)}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 mr-2"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => handleDeleteAlumno(alumno.id)}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300"
                          >
                            Eliminar
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Nuevo contenedor para la lista de equipos */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-2">Lista de Equipos</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Nombre del Equipo</th>
                  <th className="px-4 py-2 text-left">Integrantes</th>
                  <th className="px-4 py-2 text-left">Llave de Equipo</th>
                  <th className="px-4 py-2 text-left">Estado</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {equipos.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No hay equipos registrados
                    </td>
                  </tr>
                ) : (
                  equipos.map((equipo) => (
                    <tr key={equipo.id}>
                      <td className="px-4 py-2">{equipo.nombre}</td>
                      <td className="px-4 py-2">{equipo.integrantes || 0}</td>
                      <td className="px-4 py-2">{equipo.codigo || "N/A"}</td>
                      <td className="px-4 py-2 text-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={equipo.activa}
                            onChange={() => handleToggleEstado(equipo.id)}
                          />
                          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 
                            dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full 
                            rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] 
                            after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border 
                            after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 
                            peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600">
                          </div>
                        </label>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleOpenViewEquipoModal(equipo.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 mr-2"
                        >
                          Ver equipo
                        </button>

                        <button
                          onClick={() => handleAsignarAlumnosClick(equipo.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 mr-2"
                        >
                          Asignar Alumnos
                        </button>

                        <button
                          onClick={() => {
                            setEquipoIdParaEditar(equipo.id);  // id del equipo actual
                            setNuevoNombreEquipo(equipo.nombre); // para precargar
                            setShowEditarNombreModal(true);
                          }}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 mr-2"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => handleDeleteEquipo(equipo.id)}
                          className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300"
                        >
                          Eliminar
                        </button>

                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showEditarNombreModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Editar Nombre del Equipo</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700">Nuevo Nombre</label>
                  <input
                    type="text"
                    value={nuevoNombreEquipo}
                    onChange={(e) => setNuevoNombreEquipo(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Nombre del equipo"
                  />
                </div>

                <div className="flex justify-center gap-4">
<button
          type="button"
onClick={() => handleEditarEquipoName(equipoIdParaEditar)}

          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Actualizar
        </button>
        <button
          type="button"
          onClick={() =>setShowEditarNombreModal(false)}

          className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          Cancelar
        </button>
                </div>
              </form>
            </div>
          </div>
        )}


        {/* Modal para registrar o editar alumnos */}
{showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-xl font-bold mb-4">Registrar Alumno</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">Nombre</label>
          <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Apellidos</label>
          <input type="text" value={formData.apellidos} onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">NickName</label>
          <input type="text" value={formData.nickname} onChange={(e) => setFormData({ ...formData, nickname: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleRegisterAlumno}
            className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all duration-300"
          >
            Registrar
          </button>

          <button
            type="button"
            onClick={() => {
              setShowModal(false);
              setFormData({ nombre: '', apellidos: '', nickname: '', salon_id: id, equipo: null });
            }}
            className="ml-2 py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-all duration-300"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{showEditarModal && editingAlumno && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-xl font-bold mb-4">Editar Alumno</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">Nombre</label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Apellidos</label>
          <input
            type="text"
            value={formData.apellidos}
            onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">NickName</label>
          <input
            type="text"
            value={formData.nickname}
            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleUpdateAlumno}
            className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all duration-300"
          >
            Actualizar
          </button>
          <button
            type="button"
            onClick={() => {
              setShowEditarModal(false);
              setEditingAlumno(null);
              setFormData({ nombre: '', apellidos: '', nickname: '', salon_id: id, equipo: null });
            }}
            className="ml-2 py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-all duration-300"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
)}





        {/* Modal para crear equipo */}
        {showEquipoModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">Crear Equipo</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700">Nombre del Equipo</label>
                  <input
                    type="text"
                    value={formEquipoData.nombre_equipo}
                    onChange={(e) => setFormEquipoData({ ...formEquipoData, nombre_equipo: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex justify-end">
<button
  type="button"
  onClick={handleCreateEquipo}
  className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all duration-300"
>
  Crear
</button>

<button
  type="button"
  onClick={() => setShowEquipoModal(false)}
  className="ml-2 py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-all duration-300"
>
  Cancelar
</button>

                </div>
              </form>
            </div>
          </div>
        )}

        {showAsignarModal && (
          <AsignarAlumnosModal
            equipoId={selectedEquipoId}
            showModal={showAsignarModal}
            setShowModal={setShowAsignarModal}
            alumnos={alumnos}
            handleAsignar={handleAsignarAlumnos}
          />
        )}

        {/* Modal de "Ver equipo" */}
        {showViewEquipoModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-5 rounded-lg shadow-lg w-1/3">
                  <h2 className="text-xl font-bold mb-4">Estudiantes del Equipo</h2>

                  {/* Mostrar loading o error */}
                  {loading ? (
                    <p className="text-center">Cargando...</p>
                  ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                  ) : (
                     <ul>
                      {alumnosEquipo.length > 0 ? (
                        alumnosEquipo.map((alumno) => (
                          <li key={alumno.id} className="py-1 border-b flex justify-between items-center">
                            <span>{alumno.nombre} {alumno.apellidos} - {alumno.nickname}</span>
                            <FaTrash 
                              className="text-red-500 cursor-pointer hover:text-red-700"
                              onClick={() => handleEliminarEstudiante(alumno.id)}
                              title="Eliminar estudiante"
                            />
                          </li>
                        ))
                      ) : (
                        <p className="text-center">Sin estudiantes</p> 
                      )}
                    </ul>


                  )}

<button
  onClick={handleCloseViewEquipoModal}
  className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold transition-all duration-300"
>
  Cerrar
</button>

                </div>
              </div>
            )}

      </div>
    </div>

    
  );
};

export default ClassroomStudents;
