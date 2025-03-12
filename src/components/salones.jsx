import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { FaArrowLeft } from 'react-icons/fa';

const Salones = () => {
  const navigate = useNavigate();
  const [salones, setSalones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    grado: '',
    grupo: '',
    cicloInicio: new Date().getFullYear(), // Año actual
    cicloFin: new Date().getFullYear() + 1, // Año siguiente
  });
  const [editingSalon, setEditingSalon] = useState(null); // Añadido para gestionar el salón que se está editando

  // Cargar los salones desde localStorage (si existieran) al inicio
  useEffect(() => {
    const savedSalones = localStorage.getItem('salones');
    if (savedSalones) {
      setSalones(JSON.parse(savedSalones));
    }
  }, []);

  // Guardar los salones en localStorage cuando se actualicen
  useEffect(() => {
    if (salones.length > 0) {
      localStorage.setItem('salones', JSON.stringify(salones));
    }
  }, [salones]);

  const handleRegisterSalon = () => {
    const newSalon = {
      id: salones.length + 1,
      grado: formData.grado,
      grupo: formData.grupo,
      cicloInicio: formData.cicloInicio,
      cicloFin: formData.cicloFin,
      cantidadAlumnos: 0,
    };
    setSalones([...salones, newSalon]);
    setShowModal(false);
    setFormData({ grado: '', grupo: '', cicloInicio: new Date().getFullYear(), cicloFin: new Date().getFullYear() + 1 });
  };

  // Abrir el modal para editar un salón
  const handleEditSalon = (salon) => {
    setEditingSalon(salon); // Guardamos el salón que estamos editando
    setFormData({
      grado: salon.grado,
      grupo: salon.grupo,
      cicloInicio: salon.cicloInicio,
      cicloFin: salon.cicloFin,
    });
    setShowModal(true);
  };

  // Actualizar salón después de editar
  const handleUpdateSalon = () => {
    const updatedSalones = salones.map(salon =>
      salon.id === editingSalon.id ? { ...salon, ...formData } : salon
    );
    setSalones(updatedSalones);
    setShowModal(false);
    setEditingSalon(null);
    setFormData({ grado: '', grupo: '', cicloInicio: new Date().getFullYear(), cicloFin: new Date().getFullYear() + 1 });
  };

  const handleDeleteSalon = (id) => {
    setSalones(salones.filter(salon => salon.id !== id));
  };

  const handleViewAlumnos = (id) => {
    navigate(`/salon/${id}/alumnos`);
  };

  const getCantidadAlumnos = (id) => {
    const savedAlumnos = localStorage.getItem(`alumnos_salon_${id}`);
    if (savedAlumnos) {
      const alumnos = JSON.parse(savedAlumnos);
      return alumnos.length;
    }
    return 0;
  };

  const renderTable = () => (
    <table className="w-full bg-white rounded-lg shadow-md">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left">Grado</th>
          <th className="px-4 py-2 text-left">Grupo</th>
          <th className="px-4 py-2 text-left">Ciclo Escolar</th>
          <th className="px-4 py-2 text-left">Cantidad de Alumnos</th>
          <th className="px-4 py-2 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {salones.map(salon => (
          <tr key={salon.id}>
            <td className="px-4 py-2">{salon.grado}</td>
            <td className="px-4 py-2">{salon.grupo}</td>
            <td className="px-4 py-2">{salon.cicloInicio} - {salon.cicloFin}</td>
            <td className="px-4 py-2">{getCantidadAlumnos(salon.id)}</td>
            <td className="px-4 py-2 text-center">
              <button
                onClick={() => handleEditSalon(salon)} // Llamamos a la función de editar
                className="mr-2 py-1 px-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteSalon(salon.id)}
                className="mr-2 py-1 px-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Eliminar
              </button>
              <button
                onClick={() => handleViewAlumnos(salon.id)}
                className="py-1 px-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Ver Alumnos
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderModal = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">{editingSalon ? 'Editar Salón' : 'Registrar Salón'}</h2>
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
                <option key={grado} value={grado}>
                  {grado}
                </option>
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
                <option key={grupo} value={grupo}>
                  {grupo}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Ciclo Escolar Inicio</label>
            <input
              type="number"
              value={formData.cicloInicio}
              onChange={(e) => setFormData({ ...formData, cicloInicio: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Ciclo Escolar Fin</label>
            <input
              type="number"
              value={formData.cicloFin}
              onChange={(e) => setFormData({ ...formData, cicloFin: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={editingSalon ? handleUpdateSalon : handleRegisterSalon}
              className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {editingSalon ? 'Actualizar' : 'Registrar'}
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
          Registrar Salon
        </button>

        <div className="overflow-x-auto">
          {renderTable()}
        </div>
      </div>

      {showModal && renderModal()}
    </div>
  );
};

export default Salones;
