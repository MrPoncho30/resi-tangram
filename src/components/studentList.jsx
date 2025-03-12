// StudentList.js (solo muestra una vista previa con botones)
import React from 'react';
import { Link } from 'react-router-dom';

const StudentList = ({ students }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Alumnos</h2>

      <div className="mb-4">
        <ul>
          {students.slice(0, 5).map((student) => (
            <li key={student.id} className="mb-2">
              <span>{student.firstName} {student.lastName} - {student.grade}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4">
        <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
          <Link to="/addStudent">Registrar Alumno</Link>
        </button>
        <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
          <Link to="/studentPage">Ver Lista Completa</Link>
        </button>
      </div>
    </div>
  );
};

export default StudentList;
