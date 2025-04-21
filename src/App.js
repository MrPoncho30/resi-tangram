import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from "react";

import CreateTeacherForm from './components/createTeacher';
import Dashboard from './components/dashboard';
import LoginTeacher from './components/loginTeacher';
import Salones from './components/salones';
import ClassroomStudents from './components/classroom_students';
import ActivitiesPanel from './components/activitiesPanel';

// Componentes del ESTUDIANTE
import Login from "./components/students/loginStudent"; // Login de estudiante

// Componentes del JUEGO 
import TangramGame from './components/game/tangramPuzzle';
import Board from "./components/game/board";

// Componentes del CHAT
import ChatRoom from './components/game/chat/chatRoom';
import { useNavigate } from 'react-router-dom';

function App() {
  const [student, setStudent] = useState(null);

  // Componente wrapper para manejar la navegación después del login
  const LoginWrapper = () => {
    const navigate = useNavigate();

    const handleJoin = (nickname, teamCode) => {
      setStudent({ nickname, teamCode });
      navigate("/components/game/board");
    };

    return <Login onJoin={handleJoin} />;
  };

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

        {/* Ruta para el login del estudiante que redirige a Board directamente */}
        <Route path="/components/students/loginStudent" element={<LoginWrapper />} />

        {/* Ruta para el chat */}
        <Route 
          path="/chatroom" 
          element={student ? <ChatRoom nickname={student.nickname} /> : <LoginWrapper />} 
        />

        {/* Rutas del juego */}
        <Route path="/components/game/tangramPuzzle" element={<TangramGame />} />
        <Route path="/components/game/board" element={<Board />} />
      </Routes>
    </Router>
  );
}

export default App;
