import React, { useState } from 'react';

const StudentList = ({ students }) => {
  const [groupFilter, setGroupFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

 
  const filteredStudents = students.filter((student) => {
    const matchesGroup = groupFilter ? student.group.toLowerCase().includes(groupFilter.toLowerCase()) : true;
    const matchesGrade = gradeFilter ? student.grade.toString().includes(gradeFilter) : true;
    return matchesGroup && matchesGrade;
  });

 
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
                  <th>Edad</th>
                  <th>Grado</th>
                  <th>Grupo</th>
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
                      <td>${student.age}</td>
                      <td>${student.grade}</td>
                      <td>${student.group}</td>
                      <td>${student.schoolCycle}</td>
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

  return (
    <div className="max-w-xl mx-auto p-4 mt-8">
      <h2 className="text-2xl font-semibold mb-4">Lista de Estudiantes</h2>

     
      <div className="mb-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-2">Filtrar por Grupo</label>
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Selecciona un grupo</option>
              {['A', 'B', 'C', 'D'].map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
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

    
      <button
        onClick={openStudentListInNewWindow}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Abrir Lista Completa
      </button>

  
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b border-gray-200 text-left">Apellido</th>
            <th className="px-4 py-2 border-b border-gray-200 text-left">Grado</th>
            <th className="px-4 py-2 border-b border-gray-200 text-left">Grupo</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td className="px-4 py-2 border-b border-gray-100">{student.lastName}</td>
              <td className="px-4 py-2 border-b border-gray-100">{student.grade}</td>
              <td className="px-4 py-2 border-b border-gray-100">{student.group}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
