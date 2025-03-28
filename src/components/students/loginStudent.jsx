// import React from 'react';
// import { useNavigate } from 'react-router-dom'; 

// const WaitingRoom = () => {
//   const navigate = useNavigate(); 

//   const handleStartClick = () => {
//     navigate('/waiting'); 
//   };

//   return (
//     <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center">
//       <div className="bg-white shadow-xl rounded-lg p-8 w-full sm:w-96 mx-4">
//         <h1 className="text-3xl font-bold text-center text-[#1B396A] mb-4">
//           ¡Bienvenidos al Juego!
//         </h1>
//         <p className="text-lg text-center text-gray-600 mb-6">
//           Esperando a que los jugadores se unan...
//         </p>

//         <div className="space-y-4">
//           <div>
//             <label htmlFor="playerName" className="block text-gray-700 text-sm">
//               Escribe tu nombre:
//             </label>
//             <input
//               type="text"
//               id="playerName"
//               className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B396A] focus:border-[#1B396A]"
//               placeholder="Tu nombre"
//             />
//           </div>

//           <div>
//             <label htmlFor="gameId" className="block text-gray-700 text-sm">
//               ID del juego:
//             </label>
//             <input
//               type="text"
//               id="gameId"
//               className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B396A] focus:border-[#1B396A]"
//               placeholder="ID del juego"
//             />
//           </div>

//           <button
//             onClick={handleStartClick} 
//             className="w-full bg-[#1B396A] text-white py-3 rounded-full hover:bg-[#2C5282] transition duration-300 mt-4"
//           >
//             Comenzar
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WaitingRoom;

// import { useState } from "react";

// function Login({ onJoin }) {
//   const [nickname, setNickname] = useState("");
//   const [teamCode, setTeamCode] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (nickname.trim() && teamCode.trim()) {
//       onJoin(nickname, teamCode);
//     }
//   };

//   return (
//     <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-200 to-indigo-300">
//       <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center">
//         <h2 className="text-2xl font-bold text-gray-700 mb-4">Unirse a un equipo</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             placeholder="Nickname"
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//             value={nickname}
//             onChange={(e) => setNickname(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Código del equipo"
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//             value={teamCode}
//             onChange={(e) => setTeamCode(e.target.value)}
//           />
//           <button 
//             type="submit" 
//             className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
//           >
//             Unirse al equipo
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;


// import { useState } from "react";

// function Login({ onJoin }) {
//   const [nickname, setNickname] = useState("");
//   const [teamCode, setTeamCode] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (nickname.trim() && teamCode.trim()) {
//       onJoin(nickname, teamCode);
//     }
//   };

//   return (
//     <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-200 to-indigo-300">
//       <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center">
//         <h2 className="text-2xl font-bold text-gray-700 mb-4">Unirse a un equipo</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             placeholder="Nickname"
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//             value={nickname}
//             onChange={(e) => setNickname(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Código del equipo"
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//             value={teamCode}
//             onChange={(e) => setTeamCode(e.target.value)}
//           />
//           <button 
//             type="submit" 
//             className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
//           >
//             Unirse al equipo
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;

import { useState } from "react";

function LoginStudent({ onJoin }) {
  const [nickname, setNickname] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nickname.trim() || !teamCode.trim()) {
      setError("Por favor, ingresa un nickname y código de equipo.");
      return;
    }

    try {
      const response = await fetch("https://tuapi.com/login-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, teamCode }),
      });

      const data = await response.json();

      if (response.ok) {
        onJoin(nickname, teamCode);
      } else {
        setError(data.message || "Error al unirse al equipo.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-200 to-indigo-300">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Ingresa con tu equipo Tangram</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nickname"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
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
            Unirse al equipo
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginStudent;
