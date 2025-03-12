import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFilePdf } from 'react-icons/fa';  // Importamos el icono PDF
import Navbar from './navbar';  // Asegúrate de que el archivo Navbar esté correctamente importado

const StudentPage = () => {
  const [students, setStudents] = useState([]);  // Este estado contiene la lista de estudiantes
  const [groupFilter, setGroupFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [salon, setSalon] = useState('');
  const [schoolYear] = useState('');
  const [salones, setSalones] = useState([]);  // Estado para almacenar los salones registrados

  const navigate = useNavigate();

  // Obtener el año actual
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  // Generar el ciclo escolar (ej. 2024-2025)
  const currentSchoolYear = `${currentYear}-${nextYear}`;

  // Filtra los estudiantes según el grupo y el grado
  const filteredStudents = students.filter((student) => {
    const matchesGroup = groupFilter ? student.salon.toLowerCase().includes(groupFilter.toLowerCase()) : true;
    const matchesGrade = gradeFilter ? student.salon.toString().includes(gradeFilter) : true;
    return matchesGroup && matchesGrade;
  });

  // Función para agregar estudiante
  const handleAddStudent = (e) => {
    e.preventDefault();
    const newStudent = {
      id: Date.now(),
      firstName,
      lastName,
      nickname,
      salon,
      schoolYear: currentSchoolYear, // Asignar el ciclo escolar calculado
    };
    setStudents([...students, newStudent]);
    setFirstName('');
    setLastName('');
    setNickname('');
    setSalon('');
  };

  // Función para abrir la lista completa de estudiantes en una nueva ventana
  const openStudentListInNewWindow = () => {
    const newWindow = window.open('', '_blank', 'width=800,height=600');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Lista de Estudiantes</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid black; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h2>Lista Completa de Estudiantes</h2>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Nickname</th>
                  <th>Salón</th>
                  <th>Ciclo Escolar</th>
                </tr>
              </thead>
              <tbody>
                ${students
                  .map(student => `
                    <tr>
                      <td>${student.firstName}</td>
                      <td>${student.lastName}</td>
                      <td>${student.nickname}</td>
                      <td>${student.salon}</td>
                      <td>${student.schoolYear}</td>
                    </tr>
                  `)
                  .join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  // Función para agregar un salón al sistema (esto es solo un ejemplo)
  const handleAddSalon = (newSalon) => {
    setSalones([...salones, newSalon]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Navbar />  {/* Aquí se incluye el Navbar */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Panel de Administrador - Estudiantes
        </h1>

        {/* Formulario para agregar estudiante */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Agregar Estudiante</h2>
          <form onSubmit={handleAddStudent} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Nombre(s)</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Ingrese el nombre"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Apellido(s)</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Ingrese el apellido"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Nickname</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Ingrese el nickname"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Salón</label>
              <select
                value={salon}
                onChange={(e) => setSalon(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Selecciona un salón</option>
                {salones.map((salon, index) => (
                  <option key={index} value={salon}>
                    {salon}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Agregar Estudiante
              </button>
            </div>
          </form>
        </div>

        {/* Lista de estudiantes */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Lista de Estudiantes</h2>

          {/* Filtros */}
          <div className="mb-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 font-medium mb-2">Filtrar por Salón</label>
                <input
                  type="text"
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Filtrar por salón"
                />
              </div>

              <div className="flex-1">
                <label className="block text-gray-700 font-medium mb-2">Filtrar por Grado</label>
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Selecciona un grado</option>
                  {[1, 2, 3, 4, 5, 6].map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tabla de estudiantes filtrados */}
          <table className="min-w-full table-auto border-collapse border border-gray-300 mt-6">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b border-gray-200 text-left">Apellido</th>
                <th className="px-4 py-2 border-b border-gray-200 text-left">Salón</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-4 py-2 border-b border-gray-100">{student.lastName}</td>
                  <td className="px-4 py-2 border-b border-gray-100">{student.salon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Botón para abrir la lista completa en una nueva ventana */}
        <div className="text-center">
          <button
            onClick={openStudentListInNewWindow}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Ver Lista Completa de Estudiantes
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
