// import React, { useState } from 'react';
// import Navbar from './navbar';

// const ActivitiesPanel = ({ user }) => {
//   const [actividades, setActividades] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [newActivity, setNewActivity] = useState({ nombre: '', imagen: null });
//   const [showAssignModal, setShowAssignModal] = useState(false);
//   const [selectedActivity, setSelectedActivity] = useState(null);
//   const [selectedSalones, setSelectedSalones] = useState([]);
//   const salonesDisponibles = ['Salón 1', 'Salón 2', 'Salón 3'];

//   const handleEliminar = (id) => {
//     setActividades(actividades.filter(actividad => actividad.id !== id));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const nuevaActividad = {
//       id: actividades.length + 1,
//       nombre: newActivity.nombre,
//       imagen: newActivity.imagen,
//       fecha: new Date().toISOString().split('T')[0],
//       salones: [],
//       maestroId: user.id,
//       maestroNombre: user.nombre
//     };
//     setActividades([...actividades, nuevaActividad]);
//     setShowForm(false);
//     setNewActivity({ nombre: '', imagen: null });
//   };

//   const handleAssign = (actividad) => {
//     setSelectedActivity(actividad);
//     setSelectedSalones(actividad.salones);
//     setShowAssignModal(true);
//   };

//   const handleConfirmAssign = () => {
//     setActividades(actividades.map(act => 
//       act.id === selectedActivity.id ? { ...act, salones: selectedSalones } : act
//     ));
//     setShowAssignModal(false);
//   };

//   const handleCheckboxChange = (salon) => {
//     setSelectedSalones(prevSalones =>
//       prevSalones.includes(salon)
//         ? prevSalones.filter(s => s !== salon)
//         : [...prevSalones, salon]
//     );
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setNewActivity((prev) => ({ ...prev, imagen: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex">
//       <Navbar />
//       <div className="flex-1 p-6">
//         <h2 className="text-xl font-semibold mb-4">Panel de Actividades</h2>
//         <button 
//           onClick={() => setShowForm(true)}
//           className="mb-4 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-800 transition">
//           Subir Nueva Actividad
//         </button>
//         {showForm && (
//           <form onSubmit={handleSubmit} className="mb-4 bg-white p-4 rounded-lg shadow-md">
//             <label className="block mb-2">
//               Nombre de la Actividad:
//               <input 
//                 type="text" 
//                 value={newActivity.nombre} 
//                 onChange={(e) => setNewActivity({ ...newActivity, nombre: e.target.value })} 
//                 className="border p-2 w-full rounded-md"
//                 required
//               />
//             </label>
//             <label className="block mb-2">
//               Subir Imagen:
//               <input 
//                 type="file" 
//                 accept="image/*" 
//                 onChange={handleImageChange} 
//                 className="border p-2 w-full rounded-md"
//                 required
//               />
//             </label>
//             {newActivity.imagen && (
//               <div className="mb-4">
//                 <img src={newActivity.imagen} alt="Vista previa" className="h-32 w-32 object-cover" />
//               </div>
//             )}
//             <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2">Guardar</button>
//             <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 text-white py-2 px-4 rounded-md">Cancelar</button>
//           </form>
//         )}
//         <table className="w-full border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border p-2">Imagen</th>
//               <th className="border p-2">Nombre</th>
//               <th className="border p-2">Fecha de Subida</th>
//               <th className="border p-2">Salones Asignados</th>
//               <th className="border p-2">Maestro</th>
//               <th className="border p-2">Acciones</th>
//             </tr>
//           </thead>
//           <tbody>
//             {actividades.map(actividad => (
//               <tr key={actividad.id} className="text-center">
//                 <td className="border p-2">
//                   <img src={actividad.imagen} alt="Actividad" className="h-16 w-16 mx-auto" />
//                 </td>
//                 <td className="border p-2">{actividad.nombre}</td>
//                 <td className="border p-2">{actividad.fecha}</td>
//                 <td className="border p-2">{actividad.salones.join(', ')}</td>
//                 <td className="border p-2">{actividad.maestroNombre}</td>
//                 <td className="border p-2">
//                   <button onClick={() => handleEliminar(actividad.id)} className="bg-red-500 text-white px-2 py-1 rounded-md mx-1 hover:bg-red-700">Eliminar</button>
//                   <button onClick={() => handleAssign(actividad)} className="bg-purple-500 text-white px-2 py-1 rounded-md mx-1 hover:bg-purple-700">Asignar a</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ActivitiesPanel;

// --------------------  INTENTO CON ARRAY -------------------------------------//

// import React, { useState } from 'react';
// import Navbar from './navbar';

// const ActivitiesPanel = ({ user }) => {
//   const [actividades, setActividades] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [newActivity, setNewActivity] = useState({ nombre: '', horas: 0, minutos: 0, segundos: 0, imagenes: [] });
//   const [showAssignModal, setShowAssignModal] = useState(false);
//   const [selectedActivity, setSelectedActivity] = useState(null);
//   const [selectedSalones, setSelectedSalones] = useState([]);
//   const salonesDisponibles = ['Salón 1', 'Salón 2', 'Salón 3'];

//   // Banco de tangrams precargado
//   const bancoTangrams = [
//     '/images/tangram1.png',
//     '/images/tangram2.png',
//     '/images/tangram3.png',
//     '/images/tangram4.png'
//   ];

//   const handleEliminar = (id) => {
//     setActividades(actividades.filter(actividad => actividad.id !== id));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const tiempoFormato = `${String(newActivity.horas).padStart(2, '0')}:${String(newActivity.minutos).padStart(2, '0')}:${String(newActivity.segundos).padStart(2, '0')}`;
//     const nuevaActividad = {
//       id: actividades.length + 1,
//       nombre: newActivity.nombre,
//       tiempo: tiempoFormato,
//       imagenes: newActivity.imagenes,
//       fecha: new Date().toISOString().split('T')[0],
//       salones: [],
//       maestroId: user.id,
//       maestroNombre: user.nombre
//     };
//     setActividades([...actividades, nuevaActividad]);
//     setShowForm(false);
//     setNewActivity({ nombre: '', horas: 0, minutos: 0, segundos: 0, imagenes: [] });
//   };

//   const handleImageSelect = (imagen) => {
//     setNewActivity(prev => ({
//       ...prev,
//       imagenes: prev.imagenes.includes(imagen)
//         ? prev.imagenes.filter(img => img !== imagen)
//         : [...prev.imagenes, imagen]
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex">
//       <Navbar />
//       <div className="flex-1 p-6">
//         <h2 className="text-xl font-semibold mb-4">Panel de Actividades</h2>
//         <button 
//           onClick={() => setShowForm(true)}
//           className="mb-4 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-800 transition">
//           Crear Actividad
//         </button>
//         {showForm && (
//           <form onSubmit={handleSubmit} className="mb-4 bg-white p-4 rounded-lg shadow-md">
//             <label className="block mb-2">
//               Nombre de la Actividad:
//               <input 
//                 type="text" 
//                 value={newActivity.nombre} 
//                 onChange={(e) => setNewActivity({ ...newActivity, nombre: e.target.value })} 
//                 className="border p-2 w-full rounded-md"
//                 required
//               />
//             </label>
//             <label className="block mb-2">
//               Tiempo de la Actividad:
//               <div className="flex gap-2">
//                 <input 
//                   type="number" 
//                   min="0" 
//                   value={newActivity.horas} 
//                   onChange={(e) => setNewActivity({ ...newActivity, horas: parseInt(e.target.value) || 0 })} 
//                   className="border p-2 w-16 rounded-md"
//                   placeholder="hh"
//                   required
//                 />
//                 <span>:</span>
//                 <input 
//                   type="number" 
//                   min="0" max="59"
//                   value={newActivity.minutos} 
//                   onChange={(e) => setNewActivity({ ...newActivity, minutos: parseInt(e.target.value) || 0 })} 
//                   className="border p-2 w-16 rounded-md"
//                   placeholder="mm"
//                   required
//                 />
//                 <span>:</span>
//                 <input 
//                   type="number" 
//                   min="0" max="59"
//                   value={newActivity.segundos} 
//                   onChange={(e) => setNewActivity({ ...newActivity, segundos: parseInt(e.target.value) || 0 })} 
//                   className="border p-2 w-16 rounded-md"
//                   placeholder="ss"
//                   required
//                 />
//               </div>
//             </label>
//             <label className="block mb-2">Seleccionar imágenes del banco de Tangrams:</label>
//             <div className="grid grid-cols-4 gap-2 mb-4">
//               {bancoTangrams.map(imagen => (
//                 <div key={imagen} className="relative">
//                   <img 
//                     src={imagen} 
//                     alt="Tangram" 
//                     className={`h-20 w-20 object-cover border-2 rounded-md cursor-pointer ${newActivity.imagenes.includes(imagen) ? 'border-blue-500' : 'border-gray-300'}`} 
//                     onClick={() => handleImageSelect(imagen)}
//                   />
//                 </div>
//               ))}
//             </div>
//             <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2">Guardar</button>
//             <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 text-white py-2 px-4 rounded-md">Cancelar</button>
//           </form>
//         )}
//         <table className="w-full border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border p-2">Nombre</th>
//               <th className="border p-2">Tiempo</th>
//               <th className="border p-2">Fecha de Creación</th>
//               <th className="border p-2">Imágenes</th>
//               <th className="border p-2">Maestro</th>
//               <th className="border p-2">Acciones</th>
//             </tr>
//           </thead>
//           <tbody>
//             {actividades.map(actividad => (
//               <tr key={actividad.id} className="text-center">
//                 <td className="border p-2">{actividad.nombre}</td>
//                 <td className="border p-2">{actividad.tiempo}</td>
//                 <td className="border p-2">{actividad.fecha}</td>
//                 <td className="border p-2 flex justify-center gap-2">
//                   {actividad.imagenes.map((img, index) => (
//                     <img key={index} src={img} alt="Tangram" className="h-10 w-10 object-cover rounded-md" />
//                   ))}
//                 </td>
//                 <td className="border p-2">{actividad.maestroNombre}</td>
//                 <td className="border p-2">
//                   <button onClick={() => handleEliminar(actividad.id)} className="bg-red-500 text-white px-2 py-1 rounded-md mx-1 hover:bg-red-700">Eliminar</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ActivitiesPanel;

/*------------------------------- importacion id profe */ 

// import React, { useState } from 'react';
// import Navbar from './navbar';
// import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// const ActivitiesPanel = () => {
//   const navigate = useNavigate();
//   const teacherId = parseInt(localStorage.getItem("maestro")) || null;
  
//   const [actividades, setActividades] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [newActivity, setNewActivity] = useState({ nombre: '', horas: 0, minutos: 0, segundos: 0, imagenes: [] });
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const imagesPerPage = 4;

//   const bancoTangrams = [
//     '/images/tangram1.png',
//     '/images/tangram2.png',
//     '/images/tangram3.png',
//     '/images/tangram4.png',
//     '/images/tangram5.png',
//     '/images/tangram6.png'
//   ];

//   const handleEliminar = (id) => {
//     setActividades(actividades.filter(actividad => actividad.id !== id));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const tiempoFormato = `${String(newActivity.horas).padStart(2, '0')}:${String(newActivity.minutos).padStart(2, '0')}:${String(newActivity.segundos).padStart(2, '0')}`;
//     const nuevaActividad = {
//       id: actividades.length + 1,
//       nombre: newActivity.nombre,
//       tiempo: tiempoFormato,
//       imagenes: newActivity.imagenes,
//       fecha: new Date().toISOString().split('T')[0],
//       salones: [],
//       maestroId: teacherId,
//     };
//     setActividades([...actividades, nuevaActividad]);
//     setShowForm(false);
//     setNewActivity({ nombre: '', horas: 0, minutos: 0, segundos: 0, imagenes: [] });
//   };


  
//   const handleImageSelect = (imagen) => {
//     setNewActivity(prev => ({
//       ...prev,
//       imagenes: prev.imagenes.includes(imagen)
//         ? prev.imagenes.filter(img => img !== imagen)
//         : [...prev.imagenes, imagen]
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex">
//       <Navbar />
//       <div className="flex-1 p-6">
//         <h2 className="text-xl font-semibold mb-4">Panel de Actividades</h2>
//         <button onClick={() => navigate(-1)} className="flex items-center text-gray-700 hover:text-gray-900 mb-4">
//           <FaArrowLeft className="mr-2" /> Volver
//         </button>
//         <button onClick={() => setShowForm(true)} className="mb-4 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-800 transition">
//           Crear Actividad
//         </button>

//         {showForm && (
//           <form onSubmit={handleSubmit} className="mb-4 bg-white p-4 rounded-lg shadow-md">
//             <label className="block mb-2">
//               Nombre de la Actividad:
//               <input type="text" value={newActivity.nombre} onChange={(e) => setNewActivity({ ...newActivity, nombre: e.target.value })} className="border p-2 w-full rounded-md" required />
//             </label>
//             <label className="block mb-2">
//               Tiempo de la Actividad:
//               <div className="flex gap-2">
//                 <input type="number" min="0" value={newActivity.horas} onChange={(e) => setNewActivity({ ...newActivity, horas: parseInt(e.target.value) || 0 })} className="border p-2 w-16 rounded-md" placeholder="hh" required />
//                 <span>:</span>
//                 <input type="number" min="0" max="59" value={newActivity.minutos} onChange={(e) => setNewActivity({ ...newActivity, minutos: parseInt(e.target.value) || 0 })} className="border p-2 w-16 rounded-md" placeholder="mm" required />
//                 <span>:</span>
//                 <input type="number" min="0" max="59" value={newActivity.segundos} onChange={(e) => setNewActivity({ ...newActivity, segundos: parseInt(e.target.value) || 0 })} className="border p-2 w-16 rounded-md" placeholder="ss" required />
//               </div>
//             </label>

//             <div className="mt-4">
//               <h3>Selecciona imágenes:</h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
//                 {bancoTangrams.slice(currentIndex, currentIndex + imagesPerPage).map((imagen, index) => (
//                   <div key={index} onClick={() => handleImageSelect(imagen)} className={`cursor-pointer p-2 border ${newActivity.imagenes.includes(imagen) ? 'border-blue-500' : 'border-gray-300'}`}>
//                     <img src={imagen} alt={`Tangram ${index + 1}`} className="w-full h-auto" />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2">Guardar</button>
//             <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 text-white py-2 px-4 rounded-md">Cancelar</button>
//           </form>
//         )}

//         <table className="w-full border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border p-2">Nombre</th>
//               <th className="border p-2">Tiempo</th>
//               <th className="border p-2">Fecha de Creación</th>
//               <th className="border p-2">Acciones</th>
//             </tr>
//           </thead>
//           <tbody>
//             {actividades.map(actividad => (
//               <tr key={actividad.id} className="text-center">
//                 <td className="border p-2">{actividad.nombre}</td>
//                 <td className="border p-2">{actividad.tiempo}</td>
//                 <td className="border p-2">{actividad.fecha}</td>
//                 <td className="border p-2">
//                   <button onClick={() => handleEliminar(actividad.id)} className="bg-red-500 text-white px-2 py-1 rounded-md mx-1 hover:bg-red-700">Eliminar</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ActivitiesPanel;

/* --------------------- prueba MUCHO MEJOOR--------------------------*/
// import React, { useState, useEffect } from 'react';
// import Navbar from './navbar';
// import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// const ActivitiesPanel = () => {
//   const navigate = useNavigate();
//   const teacherId = parseInt(localStorage.getItem("maestro")) || null;
  
//   // Mostrar en consola el ID del profesor
//   useEffect(() => {
//     console.log('ID del profesor:', teacherId);
//   }, [teacherId]);
  
//   const [actividades, setActividades] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [newActivity, setNewActivity] = useState({ nombre: '', horas: 0, minutos: 0, segundos: 0, imagenes: [] });
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const imagesPerPage = 4;

//   const bancoTangrams = [
//     '/images/tangram1.png',
//     '/images/tangram2.png',
//     '/images/tangram3.png',
//     '/images/tangram4.png',
//     '/images/tangram5.png',
//     '/images/tangram6.png'
//   ];

//   const handleEliminar = (id) => {
//     setActividades(actividades.filter(actividad => actividad.id !== id));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const tiempoFormato = `${String(newActivity.horas).padStart(2, '0')}:${String(newActivity.minutos).padStart(2, '0')}:${String(newActivity.segundos).padStart(2, '0')}`;
//     const nuevaActividad = {
//       id: actividades.length + 1,
//       nombre: newActivity.nombre,
//       tiempo: tiempoFormato,
//       imagenes: newActivity.imagenes,
//       fecha: new Date().toISOString().split('T')[0],
//       salones: [],
//       maestroId: teacherId,
//     };
//     setActividades([...actividades, nuevaActividad]);
//     setShowForm(false);
//     setNewActivity({ nombre: '', horas: 0, minutos: 0, segundos: 0, imagenes: [] });
//   };
  
//   const handleImageSelect = (imagen) => {
//     setNewActivity(prev => ({
//       ...prev,
//       imagenes: prev.imagenes.includes(imagen)
//         ? prev.imagenes.filter(img => img !== imagen)
//         : [...prev.imagenes, imagen]
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex">
//       <Navbar />
//       <div className="flex-1 p-6">
//         <h2 className="text-xl font-semibold mb-4">Panel de Actividades</h2>
//         <button onClick={() => navigate(-1)} className="flex items-center text-gray-700 hover:text-gray-900 mb-4">
//           <FaArrowLeft className="mr-2" /> Volver
//         </button>
//         <button onClick={() => setShowForm(true)} className="mb-4 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-800 transition">
//           Crear Actividad
//         </button>

//         {showForm && (
//           <form onSubmit={handleSubmit} className="mb-4 bg-white p-4 rounded-lg shadow-md">
//             <label className="block mb-2">
//               Nombre de la Actividad:
//               <input type="text" value={newActivity.nombre} onChange={(e) => setNewActivity({ ...newActivity, nombre: e.target.value })} className="border p-2 w-full rounded-md" required />
//             </label>
//             <label className="block mb-2">
//               Tiempo de la Actividad:
//               <div className="flex gap-2">
//                 <input type="number" min="0" value={newActivity.horas} onChange={(e) => setNewActivity({ ...newActivity, horas: parseInt(e.target.value) || 0 })} className="border p-2 w-16 rounded-md" placeholder="hh" required />
//                 <span>:</span>
//                 <input type="number" min="0" max="59" value={newActivity.minutos} onChange={(e) => setNewActivity({ ...newActivity, minutos: parseInt(e.target.value) || 0 })} className="border p-2 w-16 rounded-md" placeholder="mm" required />
//                 <span>:</span>
//                 <input type="number" min="0" max="59" value={newActivity.segundos} onChange={(e) => setNewActivity({ ...newActivity, segundos: parseInt(e.target.value) || 0 })} className="border p-2 w-16 rounded-md" placeholder="ss" required />
//               </div>
//             </label>

//             <div className="mt-4">
//               <h3>Selecciona imágenes:</h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
//                 {bancoTangrams.slice(currentIndex, currentIndex + imagesPerPage).map((imagen, index) => (
//                   <div key={index} onClick={() => handleImageSelect(imagen)} className={`cursor-pointer p-2 border ${newActivity.imagenes.includes(imagen) ? 'border-blue-500' : 'border-gray-300'}`}>
//                     <img src={imagen} alt={`Tangram ${index + 1}`} className="w-full h-auto" />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2">Guardar</button>
//             <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 text-white py-2 px-4 rounded-md">Cancelar</button>
//           </form>
//         )}

//         <table className="w-full border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border p-2">Nombre</th>
//               <th className="border p-2">Tiempo</th>
//               <th className="border p-2">Fecha de Creación</th>
//               <th className="border p-2">Acciones</th>
//             </tr>
//           </thead>
//           <tbody>
//             {actividades.map(actividad => (
//               <tr key={actividad.id} className="text-center">
//                 <td className="border p-2">{actividad.nombre}</td>
//                 <td className="border p-2">{actividad.tiempo}</td>
//                 <td className="border p-2">{actividad.fecha}</td>
//                 <td className="border p-2">
//                   <button onClick={() => handleEliminar(actividad.id)} className="bg-red-500 text-white px-2 py-1 rounded-md mx-1 hover:bg-red-700">Eliminar</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ActivitiesPanel;

/* prueba MEJOR 2 ------------------------------------*/
import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ActivitiesPanel = () => {
  const navigate = useNavigate();
  const teacherId = parseInt(localStorage.getItem("maestro")) || null;

  const [actividades, setActividades] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newActivity, setNewActivity] = useState({ nombre: '', horas: 0, minutos: 0, segundos: 0, imagenes: [] });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [salones, setSalones] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const imagesPerPage = 4;

  const bancoTangrams = [
    '/assets/ALAN.png',
    '/images/tangram2.png',
    '/images/tangram3.png',
    '/images/tangram4.png',
    '/images/tangram5.png',
    '/images/tangram6.png'
  ];

  useEffect(() => {
    fetch('https://4367-2806-10b7-3-7dbd-48c6-c626-58a6-f949.ngrok-free.app/salones/api/listar_salon/')  
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta de la API: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        setSalones(data);
      })
      .catch(err => {
        console.error('Error al obtener los salones:', err.message);
      });
  }, []);
  

  const handleEliminar = (id) => {
    setActividades(actividades.filter(actividad => actividad.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tiempoFormato = `${String(newActivity.horas).padStart(2, '0')}:${String(newActivity.minutos).padStart(2, '0')}:${String(newActivity.segundos).padStart(2, '0')}`;
    const nuevaActividad = {
      id: actividades.length + 1,
      nombre: newActivity.nombre,
      tiempo: tiempoFormato,
      imagenes: newActivity.imagenes,
      fecha: new Date().toISOString().split('T')[0],
      salones: [],
      maestroId: teacherId,
    };
    setActividades([...actividades, nuevaActividad]);
    setShowForm(false);
    setNewActivity({ nombre: '', horas: 0, minutos: 0, segundos: 0, imagenes: [] });
  };

  const handleImageSelect = (imagen) => {
    setNewActivity(prev => ({
      ...prev,
      imagenes: prev.imagenes.includes(imagen)
        ? prev.imagenes.filter(img => img !== imagen)
        : [...prev.imagenes, imagen]
    }));
  };

  const handleAssignToClass = (activityId) => {
    setSelectedActivityId(activityId);
    setShowAssignModal(true);
  };

  const handleAssignActivityToClass = (salonId) => {
    const updatedActivities = actividades.map(actividad =>
      actividad.id === selectedActivityId
        ? { ...actividad, salones: [...actividad.salones, salonId] }
        : actividad
    );
    setActividades(updatedActivities);
    setShowAssignModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Navbar />
      <div className="flex-1 p-6">
        <h2 className="text-xl font-semibold mb-4">Panel de Actividades</h2>
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-700 hover:text-gray-900 mb-4">
          <FaArrowLeft className="mr-2" /> Volver
        </button>
        <button onClick={() => setShowForm(true)} className="mb-4 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-800 transition">
          Crear Actividad
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-4 bg-white p-4 rounded-lg shadow-md">
            <label className="block mb-2">
              Nombre de la Actividad:
              <input type="text" value={newActivity.nombre} onChange={(e) => setNewActivity({ ...newActivity, nombre: e.target.value })} className="border p-2 w-full rounded-md" required />
            </label>
            <label className="block mb-2">
              Tiempo de la Actividad:
              <div className="flex gap-2">
                <input type="number" min="0" value={newActivity.horas} onChange={(e) => setNewActivity({ ...newActivity, horas: parseInt(e.target.value) || 0 })} className="border p-2 w-16 rounded-md" placeholder="hh" required />
                <span>:</span>
                <input type="number" min="0" max="59" value={newActivity.minutos} onChange={(e) => setNewActivity({ ...newActivity, minutos: parseInt(e.target.value) || 0 })} className="border p-2 w-16 rounded-md" placeholder="mm" required />
                <span>:</span>
                <input type="number" min="0" max="59" value={newActivity.segundos} onChange={(e) => setNewActivity({ ...newActivity, segundos: parseInt(e.target.value) || 0 })} className="border p-2 w-16 rounded-md" placeholder="ss" required />
              </div>
            </label>

            <div className="mt-4">
              <h3>Selecciona imágenes:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {bancoTangrams.slice(currentIndex, currentIndex + imagesPerPage).map((imagen, index) => (
                  <div key={index} onClick={() => handleImageSelect(imagen)} className={`cursor-pointer p-2 border ${newActivity.imagenes.includes(imagen) ? 'border-blue-500' : 'border-gray-300'}`}>
                    <img src={imagen} alt={`Tangram ${index + 1}`} className="w-full h-auto" />
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2">Guardar</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 text-white py-2 px-4 rounded-md">Cancelar</button>
          </form>
        )}

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Tiempo</th>
              <th className="border p-2">Fecha de Creación</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {actividades.map(actividad => (
              <tr key={actividad.id} className="text-center">
                <td className="border p-2">{actividad.nombre}</td>
                <td className="border p-2">{actividad.tiempo}</td>
                <td className="border p-2">{actividad.fecha}</td>
                <td className="border p-2">
                  <button onClick={() => console.log('Ver actividad', actividad)} className="bg-blue-500 text-white px-2 py-1 rounded-md mx-1 hover:bg-blue-700">Ver</button>
                  <button onClick={() => console.log('Editar actividad', actividad)} className="bg-yellow-500 text-white px-2 py-1 rounded-md mx-1 hover:bg-yellow-700">Editar</button>
                  <button onClick={() => handleEliminar(actividad.id)} className="bg-red-500 text-white px-2 py-1 rounded-md mx-1 hover:bg-red-700">Eliminar</button>
                  <button onClick={() => handleAssignToClass(actividad.id)} className="bg-green-500 text-white px-2 py-1 rounded-md mx-1 hover:bg-green-700">Asignar a</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal Asignar a */}
        {showAssignModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h3 className="text-xl mb-4">Asignar Actividad</h3>
              <div>
                <h4 className="mb-2">Selecciona un salón:</h4>
                <select onChange={(e) => handleAssignActivityToClass(e.target.value)} className="border p-2 w-full rounded-md">
                  <option value="">Selecciona un salón</option>
                  {salones.map(salon => (
                    <option key={salon.id} value={salon.id}>{salon.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="mt-4">
                <button onClick={() => setShowAssignModal(false)} className="bg-gray-500 text-white py-2 px-4 rounded-md">Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitiesPanel;
