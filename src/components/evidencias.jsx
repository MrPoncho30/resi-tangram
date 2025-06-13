import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';

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
  fetchEvidenciasCompletas();
}, []);

  
  const fetchEvidenciasCompletas = async () => {
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

  const ObtenerValoresUnicosSelect = (array, campo) => {
    const valores = array.map (ev => ev[campo]).filter(Boolean);
    return [...new Set(valores)];
  }

  const opcionesActividad = ObtenerValoresUnicosSelect (evidenciasOriginales, "actividad");
  const opcionesSalon = ObtenerValoresUnicosSelect(evidenciasOriginales, "salon");
  const opcionesEquipo = ObtenerValoresUnicosSelect (evidenciasOriginales, "equipo");

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
  const confirmDelete = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará la evidencia permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!confirmDelete.isConfirmed) return;

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
      await Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'Evidencia eliminada correctamente.',
        timer: 2000,
        showConfirmButton: false
      });

      // 🔄 Refrescar la lista de evidencias
await fetchEvidenciasCompletas();

    } else {
      const data = await response.json();
      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar',
        text: data.error || 'Ocurrió un error inesperado.',
      });
    }

  } catch (error) {
    console.error("❌ Error de red:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'No se pudo conectar con el servidor.',
    });
  }
};


// Scroll automático al cambiar de página
useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, [paginaActual]);


  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Navbar />
      <div className="flex-1 p-6 ml-60">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Panel de Evidencia</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-700 hover:text-blue-900"
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
                {opcionesActividad.map((a, idx) => (
                  <option key={a.id} value={a}>{a}</option>
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
                  const label = e.target.value;
                  if (label) {
                    setSalon({ id: null, label });
                  } else {
                    setSalon(null);
                  }
                  setEquipo('');
                  setEquipos([]);
                }}
                className="border border-gray-300 rounded px-2 py-1 w-40"
              >
                <option value="">Todos</option>
                {opcionesSalon.map((s, idx) => (
                  <option key={idx} value={s}>{s}</option>
                ))}
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
              {opcionesEquipo.map((e) => (
                <option key={e.id} value={e}>{e}</option>
              ))}
            </select>


              <FaSearch className={`cursor-pointer ${!salon ? 'opacity-30' : 'text-gray-600'}`} onClick={filtrarEvidencias} />
            </div>
          </div>

        <button
          onClick={limpiarFiltros}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300"
        >
          Limpiar Filtros
        </button>

        </div>

        {/* TABLA */}
<div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
  <table className="w-full">
    <thead>
      <tr className="bg-gray-200 text-gray-700 text-sm uppercase tracking-wider">
        <th className="p-3 border-r last:border-r-0">Evidencia</th>
        <th className="p-3 border-r last:border-r-0">Actividad</th>
        <th className="p-3 border-r last:border-r-0">Salón</th>
        <th className="p-3 border-r last:border-r-0">Equipo</th>
        <th className="p-3 border-r last:border-r-0">Fecha</th>
        <th className="p-3">Acciones</th>
      </tr>
    </thead>
    <tbody>
      {evidenciasAMostrar.length > 0 ? (
        evidenciasAMostrar.map((ev, idx) => (
          <tr key={idx} className="text-center border-b hover:bg-gray-50 transition">
            <td className="p-4 text-sm text-gray-800 border-r last:border-r-0">{ev.nombre}</td>
            <td className="p-4 text-sm text-gray-800 border-r last:border-r-0">{ev.actividad}</td>
            <td className="p-4 text-sm text-gray-800 border-r last:border-r-0">{ev.salon}</td>
            <td className="p-4 text-sm text-gray-800 border-r last:border-r-0">{ev.equipo}</td>
            <td className="p-4 text-sm text-gray-800 border-r last:border-r-0">{ev.fecha}</td>
            <td className="p-4">
              <button
                onClick={() => {
                  console.log(ev);
                  navigate(`/evidencia/${ev.id}`);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-sm mr-2 transition-all duration-300"
              >
                Ver
              </button>
              <button
                onClick={() => handleEliminarEvidencia(ev.id)}
                className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded-lg text-sm transition-all duration-300"
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="6" className="px-4 py-6 text-center text-gray-500 text-sm">
            No hay evidencias disponibles
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


        {/* Paginación */}
{totalPaginas > 1 && (
  <div className="flex justify-center mt-4 space-x-2 items-center">

    {/* Botón Anterior */}
    {paginaActual > 1 && (
      <button
        onClick={() => setPaginaActual(paginaActual - 1)}
        className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-200"
      >
        &laquo;
      </button>
    )}

    {/* Rango de páginas inteligente */}
    {[...Array(totalPaginas)].map((_, index) => {
      const page = index + 1;
      const isNear = Math.abs(paginaActual - page) <= 2 || page === 1 || page === totalPaginas;

      // Mostrar solo si está cerca del actual o es primera / última
      if (isNear) {
        return (
          <button
            key={page}
            onClick={() => setPaginaActual(page)}
            className={`px-3 py-1 border rounded ${
              paginaActual === page
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            {page}
          </button>
        );
      }

      // Poner puntos suspensivos solo una vez antes/después de los rangos
      if (
        (paginaActual - 3 === page && page !== 1) ||
        (paginaActual + 3 === page && page !== totalPaginas)
      ) {
        return (
          <span key={page} className="px-2 text-gray-500">
            ...
          </span>
        );
      }

      return null;
    })}

    {/* Botón Siguiente */}
    {paginaActual < totalPaginas && (
      <button
        onClick={() => setPaginaActual(paginaActual + 1)}
        className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-200"
      >
        &raquo;
      </button>
    )}
  </div>
)}
      </div>
    </div>
  );
};

export default Evidencias;
