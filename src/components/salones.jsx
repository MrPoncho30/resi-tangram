import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';


// URLs de las APIs
const API_GET_SALONES_URL = 'http://127.0.0.1:8000/salones/api/listar_salon/';  
const API_CREATE_SALON_URL = 'http://127.0.0.1:8000/salones/api/crear_salones/';  
const API_DELETE_SALON_URL = 'http://127.0.0.1:8000/salones/api/eliminar_salon/salon_id/';  
const API_EDIT_SALON_URL = 'http://127.0.0.1:8000/salones/api/editar_salon/salon_id/';  

const Salones = () => {
  const navigate = useNavigate();
  const [salones, setSalones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [formError, setFormError] = useState(false);
    /////

    const [paginaActual, setPaginaActual] = useState(1);
    const salonesPorPagina = 5;

    const indiceInicio = (paginaActual - 1) * salonesPorPagina;
    const indiceFin = indiceInicio + salonesPorPagina;
    const salonesAMostrar = salones.slice(indiceInicio, indiceFin);
    const totalPaginas = Math.ceil(salones.length / salonesPorPagina);

    /////
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
      const accessToken = localStorage.getItem('accessToken'); 
      const response = await fetch(API_GET_SALONES_URL, {
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
      setSalones(data)

    } catch (error) {
      console.error('Error al cargar los salones:', error);
    }
  };

  const handleEditSalon = async (salonId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const salonToEdit = salones.find((salon) => salon.id === salonId);
  
      if (!salonToEdit) {
        console.error("No se encontró el salón con ID:", salonId);
        return;
      }
  
      // Primero, actualizamos el estado con los datos del salón
      setSelectedSalon(salonToEdit);
      setFormData({
        grado: salonToEdit.grado,
        grupo: salonToEdit.grupo,
        ciclo_escolar_inicio: salonToEdit.ciclo_escolar_inicio,
        ciclo_escolar_fin: salonToEdit.ciclo_escolar_fin,
      });
  
      // Mostramos el modal antes de llamar a la API (esto depende de tu flujo)
      setEditModal(true);
  
      // Hacemos la petición a la API (si es necesario)
      const response = await fetch(
        `${API_EDIT_SALON_URL.replace("salon_id", salonId)}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            grado: salonToEdit.grado,
            grupo: salonToEdit.grupo,
            ciclo_escolar_inicio: salonToEdit.ciclo_escolar_inicio,
            ciclo_escolar_fin: salonToEdit.ciclo_escolar_fin,
          }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al actualizar el salón:", errorData);
        return;
      }
  
      console.log("Salón actualizado correctamente");
    } catch (error) {
      console.error("Error en handleEditSalon:", error);
    }
  };
  
  // Actualizar salón con los datos editados
  const handleUpdateSalon = async () => {
    if (!selectedSalon) return;

    const updatedSalon = {
      grado: parseInt(formData.grado),
      grupo: formData.grupo,
      ciclo_escolar_inicio: selectedSalon.ciclo_escolar_inicio, 
      ciclo_escolar_fin: selectedSalon.ciclo_escolar_fin, 
    };

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_EDIT_SALON_URL.replace('salon_id', selectedSalon.id)}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSalon),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar salón: ${response.statusText}`);
      }

      fetchSalones(); // Volver a cargar los salones
      setEditModal(false);
      setSelectedSalon(null); // Limpiar el salón seleccionado
    } catch (error) {
      console.error('Error al actualizar el salón:', error);
    }
  };

  // Registrar un nuevo salón
  const handleRegisterSalon = async () => {
      const { grado, grupo, ciclo_escolar_inicio, ciclo_escolar_fin } = formData;

  // Validación de campos vacíos
  if (!grado || !grupo || !ciclo_escolar_inicio || !ciclo_escolar_fin) {
    setFormError(true);
    setTimeout(() => setFormError(false), 3000); // Oculta después de 3s
    return;
  }
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
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(salonData),
      });

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

  const handleDeleteSalon = async (salonId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });
  
    if (!result.isConfirmed) return;
  
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_DELETE_SALON_URL.replace('salon_id', salonId)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error al eliminar salón: ${response.statusText}`);
      }
  
      Swal.fire({
        title: "¡Eliminado!",
        text: "El salón ha sido eliminado.",
        icon: "success"
      });
  
// Si fetchSalones funciona bien
await fetchSalones();

// O como fallback inmediato
setSalones(prev => prev.filter(salon => salon.id !== salonId));
    } catch (error) {
      console.error('Error eliminando salón:', error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al eliminar el salón.",
        icon: "error"
      });
    }
  };
  

  const handleCancel =() =>{
    setShowModal(false);
    setSelectedSalon(null);
  }

useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, [paginaActual]);


const renderTable = () => (
  <>
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200 text-gray-700 text-sm uppercase tracking-wider">
            <th className="p-3 border-r">Grado</th>
            <th className="p-3 border-r">Grupo</th>
            <th className="p-3 border-r">Ciclo Escolar</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {salones.length > 0 ? (
            salonesAMostrar.map((salon) => (
              <tr key={salon.id} className="text-center border-b hover:bg-gray-50 transition">
                <td className="p-4 text-gray-800 text-sm border-r">{salon.grado}</td>
                <td className="p-4 text-gray-800 text-sm border-r">{salon.grupo}</td>
                <td className="p-4 text-gray-800 text-sm border-r">
                  {salon.ciclo_escolar_inicio} - {salon.ciclo_escolar_fin}
                </td>
                <td className="p-4">
                  <button
                    onClick={() =>
                      navigate(`/salon/${salon.id}/alumnos`, {
                        state: { grado: salon.grado, grupo: salon.grupo }
                      })
                    }
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 mr-2"
                  >
                    Ver alumnos
                  </button>
                  <button
                    onClick={() => handleEditSalon(salon.id)}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteSalon(salon.id)}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-4 py-6 text-center text-gray-500 text-sm">
                No hay salones disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* PAGINACIÓN */}
    {totalPaginas > 1 && (
      <div className="flex justify-center mt-4 mb-2 space-x-2 items-center">
        {paginaActual > 1 && (
          <button
            onClick={() => setPaginaActual(paginaActual - 1)}
            className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-200"
          >
            &laquo;
          </button>
        )}

        {[...Array(totalPaginas)].map((_, index) => {
          const page = index + 1;
          const isNear = Math.abs(paginaActual - page) <= 2 || page === 1 || page === totalPaginas;

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
  </>
);


return (
  <div className="min-h-screen bg-gray-100 flex">
    <Navbar />
    <div className="flex-1 p-6 ml-60">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Grupos</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-700 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2" /> Volver
        </button>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="mb-6 py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-md transition-all duration-300"
      >
        + Registrar Grupo
      </button>

      <div className="overflow-x-auto p-2">{renderTable()}</div>
    </div>

    {/* Modal de Edición */}
    {editModal && selectedSalon && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl font-bold mb-4">Editar Salón</h2>
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
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={handleUpdateSalon}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
              >
                Actualizar
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Modal de Registro */}
{showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Registrar Salón</h2>

      {formError && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
          Todos los campos son obligatorios.
        </div>
      )}

      <form>
        <div className="mb-4">
          <label className="block text-gray-700">
            Grado <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.grado}
            onChange={(e) => setFormData(prev => ({ ...prev, grado: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Seleccione un grado</option>
            {[1, 2, 3, 4, 5, 6].map(grado => (
              <option key={grado} value={grado}>{grado}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">
            Grupo <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.grupo}
            onChange={(e) => setFormData(prev => ({ ...prev, grupo: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Seleccione un grupo</option>
            {['A', 'B', 'C', 'D'].map(grupo => (
              <option key={grupo} value={grupo}>{grupo}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">
            Ciclo Escolar Inicio <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.ciclo_escolar_inicio}
            onChange={(e) => {
              const value= e.target.value;
              if (value.length <=4) {
              setFormData(prev => ({ ...prev, ciclo_escolar_inicio: e.target.value }))}}}
            className="w-full p-2 border border-gray-300 rounded-md"
            onKeyDown={(e) => e.key === 'e' && e.preventDefault()}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">
            Ciclo Escolar Fin <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.ciclo_escolar_fin}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length<=4) {
              setFormData(prev => ({ ...prev, ciclo_escolar_fin: e.target.value }))}}}
            className="w-full p-2 border border-gray-300 rounded-md"
            onKeyDown={(e) => e.key === 'e' && e.preventDefault()}
          />
        </div>

        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={handleRegisterSalon}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
          >
            Registrar
          </button>
          <button
            type="button"
            onClick={() => {
              setShowModal(false);
              setFormError(false);
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
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
