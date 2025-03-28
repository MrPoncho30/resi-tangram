import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from "react";

import CreateTeacherForm from './components/createTeacher';
import Dashboard from './components/dashboard';
import LoginTeacher from './components/loginTeacher';
import Salones from './components/salones';
import ClassroomStudents from './components/classroom_students';
import ActivitiesPanel from './components/activitiesPanel';

// Componentes del ESTUDIANTE
import Login from "./components/students/loginStudent"; // Login de estudiante
import TeamSpace from "./components/students/teamSpace";

//Componentes del JUEGO 
import TangramGame  from './components/game/tangramPuzzle';
import Board from "./components/game/board";


function App() {
  const [student, setStudent] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginTeacher />} />
        <Route path="/createTeacher" element={<CreateTeacherForm />} />
        <Route path="/loginTeacher" element={<LoginTeacher />} />
        <Route path="/salones" element={<Salones />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/salon/:id/alumnos" element={<ClassroomStudents />} />
        <Route path="/activitiesPanel" element={<ActivitiesPanel />} />

        {/* Ruta para el login del estudiante */}
        <Route 
          path="/components/students/loginStudent" 
          element={
            student ? <TeamSpace nickname={student.nickname} teamCode={student.teamCode} /> 
                    : <Login onJoin={(nickname, teamCode) => setStudent({ nickname, teamCode })} />
          } 
        />
        
        {/* Ruta para la pantalla de juego tangram */}
        <Route path="/components/game/tangramPuzzle" element={<TangramGame />} />
        <Route path="components/game/board" element={<Board />} /> 
      </Routes>
    </Router>
  );
}

export default App;
