import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';

const Evidencias = () => {
  const navigate = useNavigate();

  const [actividad, setActividad] = useState('');
  const [salon, setSalon] = useState(null);
  const [equipo, setEquipo] = useState('');

  const [evidencias, setEvidencias] = useState([]);
  const [evidenciasOriginales, setEvidenciasOriginales] = useState([]);

  const [actividades, setActividades] = useState([]);
  const [salones, setSalones] = useState([]);
  const [equipos, setEquipos] = useState([]);

  const [paginaActual, setPaginaActual] = useState(1);
  const evidenciasPorPagina = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
  
        const [evRes, actRes, salRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/evidencias/api/listar_evidencias/', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://127.0.0.1:8000/actividades/api/listar_actividad/', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://127.0.0.1:8000/salones/api/listar_salon/', {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ]);
  
        if (!evRes.ok) {
          console.warn("Token expirado o no autorizado para evidencias");
          setEvidencias([]);
          setEvidenciasOriginales([]);
        } else {
          const evData = await evRes.json();
          setEvidencias(Array.isArray(evData) ? evData : []);
          setEvidenciasOriginales(Array.isArray(evData) ? evData : []);
        }
  
        if (actRes.ok) {
          const actData = await actRes.json();
          setActividades(Array.isArray(actData) ? actData : []);
        }
  
        if (salRes.ok) {
          const salData = await salRes.json();
          setSalones(Array.isArray(salData) ? salData : []);
        }
  
      } catch (err) {
        console.error('Error al cargar los datos:', err);
        setEvidencias([]);
        setEvidenciasOriginales([]);
      }
    };
  
    fetchData();
  }, []);
  

  const fetchEquipos = async (salonId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`http://127.0.0.1:8000/equipos/api/listar_equipos/?salon_id=${salonId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setEquipos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al obtener equipos:', err);
    }
  };

  const handleSalonChange = (e) => {
    const salonId = e.target.value;
    setSalon(salonId);
    setEquipo('');
    if (salonId) {
      fetchEquipos(salonId);
    } else {
      setEquipos([]);
    }
  };

  const filtrarEvidencias = () => {
    let filtradas = [...evidenciasOriginales];

    if (actividad) {
      filtradas = filtradas.filter(ev => String(ev.actividad).toLowerCase() === String(actividad).toLowerCase());
    }

    if (salon) {
      filtradas = filtradas.filter(ev => ev.salon === salon.label);
    }
    
      
      

    if (equipo) {
      filtradas = filtradas.filter(ev => String(ev.equipo) === String(equipo));
    }

    setPaginaActual(1); // Reiniciar a la primera página
    setEvidencias(filtradas);
  };

  const limpiarFiltros = () => {
    setActividad('');
    setSalon('');
    setEquipo('');
    setEquipos([]);
    setPaginaActual(1);
    setEvidencias(evidenciasOriginales);
  };

  // Paginación
  const indiceInicio = (paginaActual - 1) * evidenciasPorPagina;
  const indiceFin = indiceInicio + evidenciasPorPagina;
  const evidenciasAMostrar = evidencias.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(evidencias.length / evidenciasPorPagina);


  const handleEliminarEvidencia = async (evidenciaId) => {
  const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar esta evidencia?");
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`http://127.0.0.1:8000/evidencias/api/eliminar_evidencia/${evidenciaId}/`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 204) {
      alert("✅ Evidencia eliminada correctamente.");
      // Aquí puedes actualizar tu estado si estás listando evidencias
    } else {
      const data = await response.json();
      alert(`❌ Error al eliminar: ${data.error || "Ocurrió un error."}`);
    }
  } catch (error) {
    console.error("❌ Error de red:", error);
    alert("No se pudo conectar con el servidor.");
  }
};


  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Navbar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Panel de Evidencia</h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2" /> Volver
          </button>
        </div>

        {/* FILTROS */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700">Actividad</label>
            <div className="flex items-center gap-2">
              <select
                value={actividad}
                onChange={(e) => {
                  setActividad(e.target.value);
                  setSalon('');
                  setEquipo('');
                  setEquipos([]);
                }}
                className="border border-gray-300 rounded px-2 py-1 w-40"
              >
                <option value="">Todas</option>
                {actividades.map((a) => (
                  <option key={a.id} value={a.nombre}>{a.nombre}</option>
                ))}
              </select>
              <FaSearch className="text-gray-600 cursor-pointer" onClick={filtrarEvidencias} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">Salón</label>
            <div className="flex items-center gap-2">
            <select
              value={salon?.label || ''}
              onChange={(e) => {
                const selected = salones.find(s => `${s.grado}° ${s.grupo}` === e.target.value);
                if (selected) {
                  setSalon({ id: selected.id, label: `${selected.grado}° ${selected.grupo}` });
                  fetchEquipos(selected.id); // sigue usando el ID correcto
                } else {
                  setSalon(null);
                  setEquipos([]);
                }
                setEquipo('');
              }}
              className="border border-gray-300 rounded px-2 py-1 w-40"
            >
              <option value="">Todos</option>
              {salones.map(s => {
                const label = `${s.grado}° ${s.grupo}`;
                return (
                  <option key={s.id} value={label}>{label}</option>
                );
              })}
            </select>


              <FaSearch className={`cursor-pointer ${!actividad ? 'opacity-30' : 'text-gray-600'}`} onClick={filtrarEvidencias} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">Equipo</label>
            <div className="flex items-center gap-2">
            <select
              value={equipo}
              onChange={(e) => setEquipo(e.target.value)}
              disabled={!salon}
              className="border border-gray-300 rounded px-2 py-1 w-40"

            >
              <option value="">Todos</option>
              {equipos.map((e) => (
                <option key={e.id} value={e.nombre}>{e.nombre}</option>
              ))}
            </select>


              <FaSearch className={`cursor-pointer ${!salon ? 'opacity-30' : 'text-gray-600'}`} onClick={filtrarEvidencias} />
            </div>
          </div>

          <button
            className="py-2 px-4 bg-blue-400 text-white rounded hover:bg-blue-500"
            onClick={limpiarFiltros}
          >
            Limpiar Filtros
          </button>
        </div>

        {/* TABLA */}
        <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border p-2">Evidencia</th>
              <th className="border p-2">Actividad</th>
              <th className="border p-2">Salón</th>
              <th className="border p-2">Equipo</th>
              <th className="border p-2">Fecha</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {evidenciasAMostrar.length > 0 ? (
              evidenciasAMostrar.map((ev, idx) => (
                <tr key={idx} className="text-center border-b hover:bg-gray-100">
                  <td className="border p-2">{ev.nombre}</td>
                  <td className="border p-2">{ev.actividad}</td>
                  <td className="border p-2">{ev.salon}</td>
                  <td className="border p-2">{ev.equipo}</td>
                  <td className="border p-2">{ev.fecha}</td>
                  <td className="border p-2">
                    <button onClick={() => {console.log(ev); navigate(`/evidencia/${ev.id}`)}} 
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2">
                      Ver
                    </button>
<button
  className="bg-red-500 text-white px-2 py-1 rounded mr-2"
  onClick={() => handleEliminarEvidencia(ev.id)}
>
  Eliminar
</button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center text-gray-500">
                  No hay evidencias disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {[...Array(totalPaginas)].map((_, index) => (
              <button
                key={index}
                onClick={() => setPaginaActual(index + 1)}
                className={`px-3 py-1 border rounded ${paginaActual === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Evidencias;
