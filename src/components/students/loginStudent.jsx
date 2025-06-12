import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import myLogo from '../../assets/logo_tan.png';
import fondo from '../../assets/bg-tangram.png'; 

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
    if (!teamCode || !selectedNickname) return;

    const estudianteSeleccionado = teamMembers.find(
      (m) => m.nickname === selectedNickname
    );

    if (!estudianteSeleccionado) {
      setError("Estudiante no encontrado.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/actividades/api/actividad_activa_por_equipo/${teamCode}/`);
      const data = await response.json();

      const isActive = data?.activo === true || data?.activo === "true";

      if (response.ok && data.id && isActive) {
        console.log("Datos de actividad activa:", data);
        navigate("/components/game/board", {
          state: {
            actividad: data,
            nickname: estudianteSeleccionado.nickname,
            studentName: estudianteSeleccionado.nombre,
            studentId: estudianteSeleccionado.id,
            equipo: equipoInfo,
            teamCode,
          },
        });
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

    sessionStorage.setItem("nickname", selectedNickname);
    sessionStorage.setItem("teamCode", teamCode);

    onJoin(selectedNickname, teamCode);
    fetchActiveActivity();
  };

  useEffect(() => {
    localStorage.removeItem("cantidadEstudiantes");
    localStorage.removeItem("teamCode");
    localStorage.removeItem("teamId");
    localStorage.removeItem("teamName");
    localStorage.removeItem("nickname");
    localStorage.removeItem("studentName");
    sessionStorage.clear();
    console.log("🔍 LocalStorage después de limpieza:", { ...localStorage });
    console.log("🔍 SessionStorage después de limpieza:", { ...sessionStorage });
  }, []);

  return (
  <div
    className="relative flex h-screen items-center justify-center bg-cover bg-center"
    style={{ backgroundImage: `url(${fondo})` }}
  >
    <div className="absolute inset-0 bg-black bg-opacity-50 z-0" /> 
    <div className="bg-white/100 p-10 rounded-[30px] shadow-2xl w-96 text-center relative overflow-hidden font-poppins z-10">
      <div className="flex justify-center mb-5">
        <img src={myLogo} alt="Logo" className="h-16 w-16 drop-shadow-md" />
      </div>
      <h2 className="text-2xl font-extrabold text-blue-600 mb-6">¡Bienvenido al mundo Tangram!</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {!isCodeValidated ? (
        <form onSubmit={handleValidateCode} className="space-y-4">
          <input
            type="text"
            placeholder="Escribe tu código aquí"
            className="w-full p-3 border-2 border-blue-300 rounded-xl focus:ring-4 focus:ring-orange-300 outline-none bg-blue-50 text-center text-lg font-semibold tracking-widest"
            value={teamCode}
            onChange={(e) => {
              const valor = e.target.value;
              const limpio = valor.replace(/\s+/g, '').slice(0, 6);
              setTeamCode(limpio);
            }}
          />
          <button
            type="submit"
            className="w-full bg-orange-400 text-blue-900 font-bold p-3 rounded-xl hover:bg-orange-500 transition duration-300 shadow-md"
          >
            Validar código
          </button>
        </form>
      ) : (
        <div className="mt-4">
          <h3 className="text-lg font-bold text-black-700 mb-3">Selecciona tu nickname:</h3>
          <ul className="text-left space-y-2 mt-2">
            {Array.isArray(teamMembers) && teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <li key={member.id} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={member.id}
                    name="nickname"
                    value={member.nickname}
                    checked={selectedNickname === member.nickname}
                    onChange={(e) => setSelectedNickname(e.target.value)}
                    className="cursor-pointer accent-orange-400 scale-125"
                  />
                  <label htmlFor={member.id} className="text-blue-800 font-medium cursor-pointer">
                    {member.nickname}
                  </label>
                </li>
              ))
            ) : (
              <p className="text-gray-600">No se han encontrado integrantes del equipo.</p>
            )}
          </ul>
          <button
            onClick={handleJoin}
            className={`mt-5 w-full p-3 rounded-xl transition duration-300 font-bold ${
              selectedNickname
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!selectedNickname}
          >
            Unirse al juego
          </button>
        </div>
      )}
    </div>
  </div>
);

}

export default LoginStudent;
