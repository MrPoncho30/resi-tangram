import React, { useState } from 'react';

const AddStudent = ({ addStudent }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [group, setGroup] = useState('');
  const [schoolYear, setSchoolYear] = useState('');

  //año actual
  const currentYear = new Date().getFullYear();

  // 2025-2026
  const schoolYearOptions = Array.from({ length: 10 }, (_, i) => {
    const startYear = currentYear + i;
    return `${startYear}-${startYear + 1}`;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (firstName && lastName && nickname && age && grade && group && schoolYear) {
      const newStudent = { 
        id: Date.now(),
        firstName, 
        lastName, 
        nickname, 
        age, 
        grade, 
        group,
        schoolYear
      };
      addStudent(newStudent);
      setFirstName('');
      setLastName('');
      setNickname('');
      setAge('');
      setGrade('');
      setGroup('');
      setSchoolYear('');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Agregar Estudiante</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="block text-gray-700 font-medium mb-2">Edad</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ingrese la edad"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Grado</label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Selecciona el grado</option>
            {[1, 2, 3, 4, 5, 6].map((gradeNumber) => (
              <option key={gradeNumber} value={gradeNumber}>{gradeNumber}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Grupo</label>
          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Selecciona el grupo</option>
            {['A', 'B', 'C', 'D'].map((groupLetter) => (
              <option key={groupLetter} value={groupLetter}>{groupLetter}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Ciclo Escolar</label>
          <select
            value={schoolYear}
            onChange={(e) => setSchoolYear(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Selecciona el ciclo escolar</option>
            {schoolYearOptions.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Agregar Estudiante
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
