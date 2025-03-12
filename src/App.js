// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { DndProvider } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";

// import WaitingRoom from './components/loginStudent'; // Pantalla inicio de estudiante
// import WaitingScreen from './components/waitingScreen'; // Pantalla de espera
// import ActivityScreen from './components/activityScreen'; // Pantalla de actividad espera
// import TangramBoard from './components/tangramPuzzle'; // Pantalla tablero de tangram 

// const App = () => (
//   <DndProvider backend={HTML5Backend}>
//     <Router>
//       <Routes>
//         <Route path="/" element={<WaitingRoom />} /> {/* Ruta de la pantalla de login */}
//         <Route path="/waiting" element={<WaitingScreen />} /> {/* Ruta de la pantalla de espera */}
//         <Route path="/activity" element={<ActivityScreen />} /> {/* Ruta de la pantalla con imagen y temp de inicio */}
//         <Route path="/tangram" element={< TangramBoard/>}/> {/* Ruta del tablero tangram*/}
//       </Routes>
//     </Router>
//   </DndProvider>
// );

// export default App;

// import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateTeacherForm from './components/createTeacher';
import Dashboard from './components/dashboard';
// import AddStudent from './components/addStudent';  
// import StudentPage from './components/studentPage'; 
import LoginTeacher from './components/loginTeacher';
import Salones from './components/salones';
import ClassroomStudents from './components/classroom_students'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginTeacher/>} />
        <Route path="/createTeacher" element={<CreateTeacherForm />} />
        <Route path="/loginTeacher" element={<LoginTeacher/>} />
        <Route path="/salones" element={<Salones/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/salon/:id/alumnos" element={<ClassroomStudents />} />
        {/* <Route path="/addStudent" element={<AddStudent addStudent={setStudents} />} />
        <Route path="/studentPage" element={<StudentPage students={students} />} /> */}
      </Routes>
    </Router>
  );
}


export default App;
