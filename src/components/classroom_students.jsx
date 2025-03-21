// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Navbar from './navbar';
// import { FaArrowLeft } from 'react-icons/fa';

// const ClassroomStudents = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [alumnos, setAlumnos] = useState([]);
//   const [equipos, setEquipos] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [showEquipoModal, setShowEquipoModal] = useState(false);
//   const [showAddStudentModal, setShowAddStudentModal] = useState(false);
//   const [showRemoveStudentModal, setShowRemoveStudentModal] = useState(false); 
//   const [selectedEquipoIndex, setSelectedEquipoIndex] = useState(null);
//   const [selectedAlumnoForRemoval, setSelectedAlumnoForRemoval] = useState(null); 
//   const [formData, setFormData] = useState({
//     nombre: '',
//     apellidos: '',
//     nickname: '',
//   });
//   const [equipoData, setEquipoData] = useState({
//     nombreEquipo: '',
//     alumnosSeleccionados: [],
//   });
//   const [editingAlumno, setEditingAlumno] = useState(null);

//   useEffect(() => {
//     const savedAlumnos = localStorage.getItem(`alumnos_salon_${id}`);
//     if (savedAlumnos) {
//       setAlumnos(JSON.parse(savedAlumnos));
//     }
//   }, [id]);

//   useEffect(() => {
//     if (alumnos.length > 0) {
//       localStorage.setItem(`alumnos_salon_${id}`, JSON.stringify(alumnos));
//     }
//   }, [alumnos, id]);

//   const handleRegisterAlumno = () => {
//     const newAlumno = { id: alumnos.length + 1, ...formData };
//     setAlumnos([...alumnos, newAlumno]);
//     setShowModal(false);
//     setFormData({ nombre: '', apellidos: '', nickname: '' });
//   };

//   const handleEditAlumno = (alumno) => {
//     setEditingAlumno(alumno);
//     setFormData({ nombre: alumno.nombre, apellidos: alumno.apellidos, nickname: alumno.nickname });
//     setShowModal(true);
//   };

//   const handleUpdateAlumno = () => {
//     const updatedAlumnos = alumnos.map((alumno) =>
//       alumno.id === editingAlumno.id ? { ...alumno, ...formData } : alumno
//     );
//     setAlumnos(updatedAlumnos);
//     setShowModal(false);
//     setEditingAlumno(null);
//     setFormData({ nombre: '', apellidos: '', nickname: '' });
//   };

//   const handleDeleteAlumno = (id) => {
//     const updatedAlumnos = alumnos.filter(alumno => alumno.id !== id);
//     setAlumnos(updatedAlumnos);
//   };

//   const handleDeleteEquipo = (equipoIndex) => {
//     const updatedEquipos = equipos.filter((_, index) => index !== equipoIndex);
//     setEquipos(updatedEquipos);
//   };

//   const handleEditEquipo = (equipoIndex) => {
//     alert(`Editar equipo ${equipoIndex}`);
//   };

//   const handleAddEquipo = () => {
//     if (!equipoData.nombreEquipo) {
//       alert("Por favor ingrese un nombre para el equipo.");
//       return;
//     }

//     const nuevoEquipo = {
//       nombre: equipoData.nombreEquipo,
//       alumnos: equipoData.alumnosSeleccionados,
//     };

//     setEquipos([...equipos, nuevoEquipo]);
//     setShowEquipoModal(false);
//     setEquipoData({ nombreEquipo: '', alumnosSeleccionados: [] });
//   };

//   const handleShowAddStudentModal = (equipoIndex) => {
//     setSelectedEquipoIndex(equipoIndex);
//     setShowAddStudentModal(true);
//   };

//   const handleAddStudentToEquipo = (alumno) => {
//     const updatedEquipos = [...equipos];
//     updatedEquipos[selectedEquipoIndex].alumnos.push(alumno);
//     setEquipos(updatedEquipos);
//     setShowAddStudentModal(false);
//   };

//   const handleShowRemoveStudentModal = (equipoIndex, alumno) => {
//     setSelectedEquipoIndex(equipoIndex);
//     setSelectedAlumnoForRemoval(alumno); // Establecer el alumno seleccionado para quitar
//     setShowRemoveStudentModal(true); // Mostrar modal
//   };

//   const handleRemoveStudentFromEquipo = () => {
//     const updatedEquipos = [...equipos];
//     updatedEquipos[selectedEquipoIndex].alumnos = updatedEquipos[selectedEquipoIndex].alumnos.filter(
//       alumno => alumno.id !== selectedAlumnoForRemoval.id
//     );
//     setEquipos(updatedEquipos);
//     setShowRemoveStudentModal(false);
//   };

//   // Filtrar estudiantes que ya están en algún equipo
//   const getAvailableStudentsForAdd = () => {
//     const studentsInTeams = equipos.flatMap(equipo => equipo.alumnos.map(a => a.id));
//     return alumnos.filter(alumno => !studentsInTeams.includes(alumno.id));
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex">
//       <Navbar />
//       <div className="flex-1 p-6">
//         <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Alumnos del Salón {id}</h1>

//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center text-gray-700 hover:text-gray-900 mb-4"
//         >
//           <FaArrowLeft className="mr-2" /> Volver
//         </button>

//         <button
//           onClick={() => setShowModal(true)}
//           className="mb-6 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//         >
//           Registrar Alumno
//         </button>
// {}
//         <div className="bg-white p-4 rounded-lg shadow-md mb-6">
//         <h2 className="text-lg font-semibold mb-2">Lista de Alumnos</h2>
//         <div className="overflow-x-auto">
//             <table className="w-full bg-white rounded-lg shadow-md">
//             <thead>
//                 <tr>
//                 <th className="px-4 py-2 text-left">Nombre(s)</th>
//                 <th className="px-4 py-2 text-left">Apellidos(s)</th>
//                 <th className="px-4 py-2 text-left">NickName</th>
//                 <th className="px-4 py-2 text-left">Acciones</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {alumnos.map((alumno) => (
//                 <tr key={alumno.id}>
//                     <td className="px-4 py-2">{alumno.nombre}</td>
//                     <td className="px-4 py-2">{alumno.apellidos}</td>
//                     <td className="px-4 py-2">{alumno.nickname}</td>
//                     <td className="px-4 py-2">
//                     <div className="flex justify-start space-x-2"> {/* Flex container */}
//                         <button
//                         onClick={() => handleEditAlumno(alumno)}
//                         className="py-1 px-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
//                         >
//                         Editar
//                         </button>
//                         <button
//                         onClick={() => handleDeleteAlumno(alumno.id)}
//                         className="py-1 px-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//                         >
//                         Eliminar
//                         </button>
//                     </div>
//                     </td>
//                 </tr>
//                 ))}
//             </tbody>
//             </table>
//         </div>
//         </div>


//         {/* Equipos Section */}
//         <button
//           onClick={() => setShowEquipoModal(true)}
//           className="mb-6 py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
//         >
//           Agregar Equipo
//         </button>
//         <div className="bg-white p-4 rounded-lg shadow-md mb-6">
//   <h2 className="text-lg font-semibold mb-2">Equipos</h2>
//   <div className="overflow-x-auto">
//     {equipos.length > 0 && (
//       <table className="w-full bg-white rounded-lg shadow-md">
//         <thead>
//           <tr>
//             <th className="px-4 py-2 text-left">Equipo</th>
//             <th className="px-4 py-2 text-left">Alumnos</th>
//             <th className="px-4 py-2 text-left">Acciones</th>
//           </tr>
//         </thead>
//         <tbody>
//           {equipos.map((equipo, index) => (
//             <tr key={index}>
//               <td className="px-4 py-2">{equipo.nombre}</td>
//               <td className="px-4 py-2">
//                 {equipo.alumnos.map(a => (
//                   <div key={a.id} className="flex justify-between items-center mb-2">
//                     <span>{a.nombre}</span>
//                     <button
//                       onClick={() => handleShowRemoveStudentModal(index, a)}
//                       className="py-1 px-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//                     >
//                       Quitar
//                     </button>
//                   </div>
//                 ))}
//               </td>
//               <td className="px-4 py-2">
//                 <div className="flex justify-start space-x-2"> {/* Flex container */}
//                   <button
//                     onClick={() => handleEditEquipo(index)}
//                     className="py-1 px-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
//                   >
//                     Editar
//                   </button>
//                   <button
//                     onClick={() => handleDeleteEquipo(index)}
//                     className="py-1 px-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//                   >
//                     Eliminar
//                   </button>
//                   <button
//                     onClick={() => handleShowAddStudentModal(index)}
//                     className="py-1 px-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                   >
//                     Agregar Estudiante
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     )}
//   </div>
// </div>

// {}
//         {/* Modal para agregar un equipo */}
//         {showEquipoModal && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white p-6 rounded-lg w-96">
//               <h2 className="text-xl font-bold mb-4">Agregar Equipo</h2>
//               <form>
//                 <div className="mb-4">
//                   <label className="block text-gray-700">Nombre del Equipo</label>
//                   <input
//                     type="text"
//                     value={equipoData.nombreEquipo}
//                     onChange={(e) => setEquipoData({ ...equipoData, nombreEquipo: e.target.value })}
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                   />
//                 </div>
//                 <div className="flex justify-end">
//                   <button
//                     type="button"
//                     onClick={handleAddEquipo}
//                     className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                   >
//                     Agregar Equipo
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setShowEquipoModal(false)}
//                     className="ml-2 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
//                   >
//                     Cancelar
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Modal para agregar un estudiante */}
//         {showAddStudentModal && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white p-6 rounded-lg w-96">
//               <h2 className="text-xl font-bold mb-4">Selecciona un Estudiante</h2>
//               <div className="mb-4">
//                 <ul>
//                   {getAvailableStudentsForAdd().map((alumno) => (
//                     <li key={alumno.id} className="flex justify-between items-center mb-2">
//                       <span>{alumno.nombre} {alumno.apellidos}</span>
//                       <button
//                         onClick={() => handleAddStudentToEquipo(alumno)}
//                         className="py-1 px-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//                       >
//                         Agregar
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div className="flex justify-end">
//                 <button
//                   onClick={() => setShowAddStudentModal(false)}
//                   className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
//                 >
//                   Cancelar
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Modal para quitar un estudiante */}
//         {showRemoveStudentModal && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white p-6 rounded-lg w-96">
//               <h2 className="text-xl font-bold mb-4">¿Estás seguro que deseas quitar a este estudiante?</h2>
//               <div className="flex justify-end">
//                 <button
//                   onClick={handleRemoveStudentFromEquipo}
//                   className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
//                 >
//                   Quitar
//                 </button>
//                 <button
//                   onClick={() => setShowRemoveStudentModal(false)}
//                   className="ml-2 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
//                 >
//                   Cancelar
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Modal para agregar alumno */}
//         {showModal && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white p-6 rounded-lg w-96">
//               <h2 className="text-xl font-bold mb-4">{editingAlumno ? 'Editar Alumno' : 'Registrar Alumno'}</h2>
//               <form>
//                 <div className="mb-4">
//                   <label className="block text-gray-700">Nombre</label>
//                   <input
//                     type="text"
//                     value={formData.nombre}
//                     onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700">Apellidos</label>
//                   <input
//                     type="text"
//                     value={formData.apellidos}
//                     onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700">NickName</label>
//                   <input
//                     type="text"
//                     value={formData.nickname}
//                     onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                   />
//                 </div>
//                 <div className="flex justify-end">
//                   <button
//                     type="button"
//                     onClick={editingAlumno ? handleUpdateAlumno : handleRegisterAlumno}
//                     className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                   >
//                     {editingAlumno ? 'Actualizar' : 'Registrar'}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setShowModal(false)}
//                     className="ml-2 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
//                   >
//                     Cancelar
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ClassroomStudents;

// /* LOGICA DE ALUMNOS  */
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Navbar from './navbar';
// import { FaArrowLeft } from 'react-icons/fa';

// const API_URL = "http://127.0.0.1:8000/estudiantes/api/crear_estudiante/";

// const ClassroomStudents = () => {
//   const { id } = useParams();  // El id del salón
//   const navigate = useNavigate();
//   const [alumnos, setAlumnos] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({
//     nombre: '',
//     apellidos: '',
//     nickname: '',
//     salon_id: id,  // El id del salón obtenido de la URL
//     equipo: null,  // El campo equipo se establece en null
//   });
//   const [editingAlumno, setEditingAlumno] = useState(null);
 

// // // Obtener alumnos desde la API
// //   useEffect(() => {
// //     const fetchAlumnos = async () => {
// //       try {
// //         const response = await fetch(`${API_URL}?salonId=${id}`);
// //         const data = await response.json();
// //         setAlumnos(data);
// //       } catch (error) {
// //         console.error("Error obteniendo alumnos:", error);
// //       }
// //     };
// //     fetchAlumnos();
// //   }, [id]);


//   // Registrar alumno en la API
//   const handleRegisterAlumno = async () => {
//     try {
//       const accessToken = localStorage.getItem('accessToken');
//       if (!accessToken){
//         console.error('No hay token');
//       }
//       console.log(accessToken);
//       console.log('Datos que se envían:', { ...formData });
//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}`},
//         body: JSON.stringify({ ...formData }),
//       });
   

//       if (!response.ok) throw new Error("Error registrando alumno");

//       const newAlumno = await response.json();
//       setAlumnos([...alumnos, newAlumno]);
//       setShowModal(false);
//       setFormData({ nombre: '', apellidos: '', nickname: '' });
//     } catch (error) {
//       console.error("Error registrando alumno:", error);
//     }
//   };


//   // Editar alumno
//   const handleEditAlumno = (alumno) => {
//     setEditingAlumno(alumno);
//     setFormData({ nombre: alumno.nombre, apellidos: alumno.apellidos, nickname: alumno.nickname, salon: alumno.salon, equipo: alumno.equipo });
//     setShowModal(true);
//   };

//   // Actualizar alumno en la API
//   const handleUpdateAlumno = async () => {
//     try {
//       const accessToken = localStorage.getItem('accessToken');
//       console.log(accessToken);
//       console.log('Datos que se envían:', { ...formData });
//       const response = await fetch(`${API_URL}/${editingAlumno.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       if (!response.ok) throw new Error("Error actualizando alumno");

//       const updatedAlumnos = alumnos.map((alumno) =>
//         alumno.id === editingAlumno.id ? { ...alumno, ...formData } : alumno
//       );
//       setAlumnos(updatedAlumnos);
//       setShowModal(false);
//       setEditingAlumno(null);
//       setFormData({ nombre: '', apellidos: '', nickname: '', salon: id, equipo: null });
//     } catch (error) {
//       console.error("Error actualizando alumno:", error);
//     }
//   };

//   // Eliminar alumno en la API
//   const handleDeleteAlumno = async (alumnoId) => {
//     try {
//       const response = await fetch(`${API_URL}/${alumnoId}`, { method: "DELETE" });
//       if (!response.ok) throw new Error("Error eliminando alumno");

//       const updatedAlumnos = alumnos.filter(alumno => alumno.id !== alumnoId);
//       setAlumnos(updatedAlumnos);
//     } catch (error) {
//       console.error("Error eliminando alumno:", error);
//     }
//   };
//   console.log(alumnos);

//   return (
//     <div className="min-h-screen bg-gray-100 flex">
//       <Navbar />
//       <div className="flex-1 p-6">
//         <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Alumnos del Salón {id}</h1>

//         <button onClick={() => navigate(-1)} className="flex items-center text-gray-700 hover:text-gray-900 mb-4">
//           <FaArrowLeft className="mr-2" /> Volver
//         </button>

//         <button onClick={() => setShowModal(true)} className="mb-6 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
//           Registrar Alumno
//         </button>

//         <div className="bg-white p-4 rounded-lg shadow-md mb-6">
//           <h2 className="text-lg font-semibold mb-2">Lista de Alumnos</h2>
//           <div className="overflow-x-auto">
//             <table className="w-full bg-white rounded-lg shadow-md">
//               <thead>
//                 <tr>
//                   <th className="px-4 py-2 text-left">Nombre(s)</th>
//                   <th className="px-4 py-2 text-left">Apellidos(s)</th>
//                   <th className="px-4 py-2 text-left">NickName</th>
//                   <th className="px-4 py-2 text-left">Acciones</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {alumnos.map((alumno) => (
//                   <tr key={alumno.id}>
//                     <td className="px-4 py-2">{alumno.nombre}</td>
//                     <td className="px-4 py-2">{alumno.apellidos}</td>
//                     <td className="px-4 py-2">{alumno.nickname}</td>
//                     <td className="px-4 py-2">
//                       <div className="flex justify-start space-x-2">
//                         <button
//                           onClick={() => handleEditAlumno(alumno)}
//                           className="py-1 px-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
//                         >
//                           Editar
//                         </button>
//                         <button
//                           onClick={() => handleDeleteAlumno(alumno.id)}
//                           className="py-1 px-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//                         >
//                           Eliminar
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Modal para registrar o editar alumnos */}
//         {showModal && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white p-6 rounded-lg w-96">
//               <h2 className="text-xl font-bold mb-4">{editingAlumno ? 'Editar Alumno' : 'Registrar Alumno'}</h2>
//               <form>
//                 <div className="mb-4">
//                   <label className="block text-gray-700">Nombre</label>
//                   <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md" />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700">Apellidos</label>
//                   <input type="text" value={formData.apellidos} onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md" />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700">NickName</label>
//                   <input type="text" value={formData.nickname} onChange={(e) => setFormData({ ...formData, nickname: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md" />
//                 </div>
//                 <div className="flex justify-end">
//                   <button type="button" onClick={editingAlumno ? handleUpdateAlumno : handleRegisterAlumno} className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
//                     {editingAlumno ? 'Actualizar' : 'Registrar'}
//                   </button>
//                   <button type="button" onClick={() => setShowModal(false)} className="ml-2 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600">
//                     Cancelar
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ClassroomStudents;


/* LOGICA CON 2 API'S */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { FaArrowLeft } from 'react-icons/fa';

const API_URL_CREATE = "http://127.0.0.1:8000/estudiantes/api/crear_estudiante/";
const API_URL_LIST = "http://127.0.0.1:8000/estudiantes/api/listar_estudiantes/";  // API para obtener los alumnos

const ClassroomStudents = () => {
  const { id } = useParams();  // El id del salón
  const navigate = useNavigate();
  const [alumnos, setAlumnos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    nickname: '',
    salon_id: id,  // El id del salón obtenido de la URL
    equipo: null,  // El campo equipo se establece en null
  });
  const [editingAlumno, setEditingAlumno] = useState(null);

  // Obtener alumnos desde la API (Utilizando la lógica que mencionaste)
  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
          console.error('No se encontró el token de acceso.');
          return;
        }

        const response = await fetch(`${API_URL_LIST}?salon_id=${id}`, {
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
        setAlumnos(data);  // Asignamos los datos obtenidos a los alumnos
      } catch (error) {
        console.error('Error al cargar los alumnos:', error);
      }
    };

    fetchAlumnos();  // Llamamos a la función cuando el componente se monta
  }, [id]); // Dependemos del id para recargar los alumnos si el salón cambia

  // Registrar alumno en la API
  const handleRegisterAlumno = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No hay token');
        return;
      }
      console.log('Datos que se envían:', { ...formData });
      const response = await fetch(API_URL_CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
        body: JSON.stringify({ ...formData }),
      });

      if (!response.ok) throw new Error("Error registrando alumno");

      const newAlumno = await response.json();
      setAlumnos([...alumnos, newAlumno]);
      setShowModal(false);
      setFormData({ nombre: '', apellidos: '', nickname: '' });
    } catch (error) {
      console.error("Error registrando alumno:", error);
    }
  };

  // Editar alumno
  const handleEditAlumno = (alumno) => {
    setEditingAlumno(alumno);
    setFormData({ nombre: alumno.nombre, apellidos: alumno.apellidos, nickname: alumno.nickname, salon: alumno.salon, equipo: alumno.equipo });
    setShowModal(true);
  };

  // Actualizar alumno en la API
  const handleUpdateAlumno = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      console.log('Datos que se envían:', { ...formData });
      const response = await fetch(`${API_URL_CREATE}/${editingAlumno.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Error actualizando alumno");

      const updatedAlumnos = alumnos.map((alumno) =>
        alumno.id === editingAlumno.id ? { ...alumno, ...formData } : alumno
      );
      setAlumnos(updatedAlumnos);
      setShowModal(false);
      setEditingAlumno(null);
      setFormData({ nombre: '', apellidos: '', nickname: '', salon: id, equipo: null });
    } catch (error) {
      console.error("Error actualizando alumno:", error);
    }
  };

  // Eliminar alumno en la API
  const handleDeleteAlumno = async (alumnoId) => {
    try {
      const response = await fetch(`${API_URL_CREATE}/${alumnoId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error eliminando alumno");

      const updatedAlumnos = alumnos.filter(alumno => alumno.id !== alumnoId);
      setAlumnos(updatedAlumnos);
    } catch (error) {
      console.error("Error eliminando alumno:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Navbar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Alumnos del Salón {id}</h1>

        <button onClick={() => navigate(-1)} className="flex items-center text-gray-700 hover:text-gray-900 mb-4">
          <FaArrowLeft className="mr-2" /> Volver
        </button>

        <button onClick={() => setShowModal(true)} className="mb-6 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Registrar Alumno
        </button>

        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-2">Lista de Alumnos</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Nombre(s)</th>
                  <th className="px-4 py-2 text-left">Apellidos(s)</th>
                  <th className="px-4 py-2 text-left">NickName</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
  {alumnos.length === 0 ? (
    <tr>
      <td colSpan="4" className="text-center py-4 text-gray-500">
        No hay alumnos registrados
      </td>
    </tr>
  ) : (
    alumnos.map((alumno) => (
      <tr key={alumno.id}>
        <td className="px-4 py-2">{alumno.nombre}</td>
        <td className="px-4 py-2">{alumno.apellidos}</td>
        <td className="px-4 py-2">{alumno.nickname}</td>
        <td className="px-4 py-2">
          <div className="flex justify-start space-x-2">
            <button
              onClick={() => handleEditAlumno(alumno)}
              className="py-1 px-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              Editar
            </button>
            <button
              onClick={() => handleDeleteAlumno(alumno.id)}
              className="py-1 px-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Eliminar
            </button>
          </div>
        </td>
      </tr>
    ))
  )}
</tbody>

            </table>
          </div>
        </div>

        {/* Modal para registrar o editar alumnos */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">{editingAlumno ? 'Editar Alumno' : 'Registrar Alumno'}</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700">Nombre</label>
                  <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Apellidos</label>
                  <input type="text" value={formData.apellidos} onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">NickName</label>
                  <input type="text" value={formData.nickname} onChange={(e) => setFormData({ ...formData, nickname: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={editingAlumno ? handleUpdateAlumno : handleRegisterAlumno} className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    {editingAlumno ? 'Actualizar' : 'Registrar'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="ml-2 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassroomStudents;
