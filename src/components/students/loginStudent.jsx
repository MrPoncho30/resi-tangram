// import { useState } from "react";
// import { useNavigate } from "react-router-dom"; 
// import myLogo from '../../assets/logo_tan.png';

// function LoginStudent({ onJoin }) {
//   const [teamCode, setTeamCode] = useState("");
//   const [error, setError] = useState("");
//   const [teamMembers, setTeamMembers] = useState([]);  // Estado inicial como un array vacío
//   const [selectedNickname, setSelectedNickname] = useState("");
//   const [isCodeValidated, setIsCodeValidated] = useState(false);
//   const navigate = useNavigate(); 

//   const handleValidateCode = async (e) => {
//     e.preventDefault();
//     if (!teamCode.trim()) {
//       setError("Por favor, ingresa un código de equipo.");
//       return;
//     }
  
//     try {
//       const response = await fetch("http://127.0.0.1:8000/estudiantes/api/obtener_integrantes/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ codigo: teamCode }),
//       });
  
//       const data = await response.json();
  
//       if (response.ok) {
//         if (Array.isArray(data.estudiantes)) {
//           setTeamMembers(data.estudiantes);
//           setIsCodeValidated(true);
//           setError("");
  
//           // Guardar datos del equipo en localStorage
//           localStorage.setItem("teamCode", teamCode);
//           localStorage.setItem("teamId", data.equipo.id_equipo);
//           localStorage.setItem("teamName", data.equipo.nombre_equipo);
//         } else {
//           setError("No se encontraron integrantes del equipo.");
//         }
//       } else {
//         setError(data.error || "El código del equipo no es válido.");
//       }
//     } catch (err) {
//       setError("No se pudo conectar con el servidor.");
//     }
//   };
  
//   const handleJoin = () => {
//     if (!selectedNickname) {
//       setError("Por favor, selecciona un nickname.");
//       return;
//     }
  
//     localStorage.setItem("nickname", selectedNickname);
  
//     const selectedStudent = teamMembers.find(member => member.nickname === selectedNickname);
//     if (selectedStudent) {
//       localStorage.setItem("studentName", `${selectedStudent.nombre} ${selectedStudent.apellidos}`);
//     }
  
//     onJoin(selectedNickname, teamCode); 
//     navigate("/components/game/board"); 
//   };
  

//   return (
//     <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-200 to-indigo-300">
//       <div className="bg-white p-8 rounded-3xl shadow-lg w-96 text-center relative overflow-hidden">
//         <div className="flex justify-center mb-4">
//           <img src={myLogo} alt="Logo" className="h-14 w-14" />
//         </div>
//         <h2 className="text-2xl font-bold text-gray-700 mb-4">Ingresa con tu equipo Tangram</h2>
//         {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

//         {!isCodeValidated ? (
//           <form onSubmit={handleValidateCode} className="space-y-4">
//             <input
//               type="text"
//               placeholder="Código del equipo"
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//               value={teamCode}
//               onChange={(e) => setTeamCode(e.target.value)}
//             />
//             <button 
//               type="submit" 
//               className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
//             >
//               Validar código
//             </button>
//           </form>
//         ) : (
//           <div className="mt-4">
//             <h3 className="text-lg font-semibold">Selecciona tu nickname:</h3>
//             <ul className="text-left space-y-2 mt-2">
//               {Array.isArray(teamMembers) && teamMembers.length > 0 ? (
//                 teamMembers.map((member) => (
//                   <li key={member.id} className="flex items-center space-x-2">
//                     <input
//                       type="radio"
//                       id={member.id}
//                       name="nickname"
//                       value={member.nickname}
//                       checked={selectedNickname === member.nickname}
//                       onChange={(e) => setSelectedNickname(e.target.value)}
//                       className="cursor-pointer"
//                     />
//                     <label htmlFor={member.id} className="text-gray-700 cursor-pointer">
//                       {member.nickname}
//                     </label>
//                   </li>
//                 ))
//               ) : (
//                 <p>No se han encontrado integrantes del equipo.</p>
//               )}
//             </ul>
//             <button 
//               onClick={handleJoin} 
//               className={`mt-4 w-full p-3 rounded-lg transition duration-300 ${
//                 selectedNickname ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
//               }`}
//               disabled={!selectedNickname}
//             >
//               Unirse
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default LoginStudent;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import myLogo from '../../assets/logo_tan.png';
import fondo from '../../assets/fondo.png'; 


function LoginStudent({ onJoin }) {
  const [teamCode, setTeamCode] = useState("");
  const [error, setError] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedNickname, setSelectedNickname] = useState("");
  const [isCodeValidated, setIsCodeValidated] = useState(false);
  const [equipoInfo, setEquipoInfo] = useState(null);
  const navigate = useNavigate(); 

  const handleValidateCode = async (e) => {
    e.preventDefault();
    if (!teamCode.trim()) {
      setError("Por favor, ingresa un código de equipo.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/estudiantes/api/obtener_integrantes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo: teamCode }),
      });

      const data = await response.json();

      if (response.ok) {
        if (Array.isArray(data.estudiantes)) {
          setTeamMembers(data.estudiantes);
          setEquipoInfo(data.equipo);
          setIsCodeValidated(true);
          setError("");

             // Guardar cantidad de estudiantes en localStorage
          localStorage.setItem("cantidadEstudiantes", data.estudiantes.length.toString());
          console.log("ESTUDIANTES OBTENIDOS: ", data.estudiantes);
        } else {
          setError("No se encontraron integrantes del equipo.");
        }
      } else {
        setError(data.error || "El código del equipo no es válido.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    }
  };

  const fetchActiveActivity = async () => {
    if (!teamCode) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/actividades/api/actividad_activa_por_equipo/${teamCode}/`);
      const data = await response.json();

      const isActive = data?.activo === true || data?.activo === "true";

      if (response.ok && data.id && isActive) {
        console.log("Datos de actividad activa:", data);
        navigate("/components/game/board", { state: { actividad: data, nickname: selectedNickname, studentName: selectedNickname, equipo: equipoInfo, teamCode } });
      } else {
        setError(data.mensaje || "No hay actividades activas por el momento.");
      }

    } catch (err) {
      setError("Error al obtener la actividad activa.");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isCodeValidated && selectedNickname) {
        fetchActiveActivity();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isCodeValidated, selectedNickname]);

  const handleJoin = () => {
    if (!selectedNickname) {
      setError("Por favor, selecciona un nickname.");
      return;
    }
  
    // 🧠 Guardar nickname en sessionStorage para que esté disponible en toda la sesión
    sessionStorage.setItem("nickname", selectedNickname);
  
    // También puedes guardar el código del equipo si lo usas después
    sessionStorage.setItem("teamCode", teamCode);
  
    onJoin(selectedNickname, teamCode);
    fetchActiveActivity();
  };
  

  return (
      <div
          className="relative flex h-screen items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${fondo})` }}
      >
         {/* Overlay negro */}
  <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />

{/* Contenido encima del overlay */}
        <div className="bg-white p-8 rounded-3xl shadow-lg w-96 text-center relative overflow-hidden">
        <div className="flex justify-center mb-4">
          <img src={myLogo} alt="Logo" className="h-14 w-14" />
        </div>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Ingresa con tu equipo Tangram</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {!isCodeValidated ? (
          <form onSubmit={handleValidateCode} className="space-y-4">
            <input
              type="text"
              placeholder="Código del equipo"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
            />
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Validar código
            </button>
          </form>
        ) : (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Selecciona tu nickname:</h3>
            <ul className="text-left space-y-2 mt-2">
              {Array.isArray(teamMembers) && teamMembers.length > 0 ? (
                teamMembers.map((member) => (
                  <li key={member.id} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={member.id}
                      name="nickname"
                      value={member.nickname}
                      checked={selectedNickname === member.nickname}
                      onChange={(e) => setSelectedNickname(e.target.value)}
                      className="cursor-pointer"
                    />
                    <label htmlFor={member.id} className="text-gray-700 cursor-pointer">
                      {member.nickname}
                    </label>
                  </li>
                ))
              ) : (
                <p>No se han encontrado integrantes del equipo.</p>
              )}
            </ul>
            <button 
              onClick={handleJoin} 
              className={`mt-4 w-full p-3 rounded-lg transition duration-300 ${
                selectedNickname ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!selectedNickname}
            >
              Unirse
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginStudent;
