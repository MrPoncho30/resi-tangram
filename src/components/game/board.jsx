import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";

import ChatRoom from "./chat/chatRoom";

import SquareSVG from "../../assets/T_cuadrado_rojo.png";
import ParallelogramSVG from "../../assets/T_romboide_azul.png";
import TriangleYellowSVG from "../../assets/T_triangulo_amarillo.png";
import TriangleBlueSVG from "../../assets/T_triangulo_azul.png";
import TrianglePurpleSVG from "../../assets/T_triangulo_morado.png";
import TrianglePinkSVG from "../../assets/T_triangulo_rosa.png";
import TriangleGreenSVG from "../../assets/T_triangulo_verde.png";

const PIECES = [
  { id: 0, image: TriangleYellowSVG },
  { id: 1, image: TriangleBlueSVG },
  { id: 2, image: TrianglePurpleSVG },
  { id: 3, image: TrianglePinkSVG },
  { id: 4, image: TriangleGreenSVG },
  { id: 5, image: SquareSVG },
  { id: 6, image: ParallelogramSVG },
];

const Board = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Se reciben los datos del login
  const actividad = location.state?.actividad;
  const nickname = location.state?.nickname;
  const studentName = location.state?.studentName;
  const teamId = location.state?.equipo?.id_equipo;
  const teamName = location.state?.equipo?.nombre_equipo;
  const codigoEquipo = location.state?.teamCode || location.state?.codigoEquipo || localStorage.getItem("teamCode");

  const [isPlaying, setIsPlaying] = useState(false);
  const [piecesState, setPiecesState] = useState(PIECES);
  const [boardPieces, setBoardPieces] = useState([]);
  const [rotation, setRotation] = useState({});
  const [draggingPiece, setDraggingPiece] = useState(null);
  const [bloqueadas, setBloqueadas] = useState({});
  const [movingBy, setMovingBy] = useState(null);
  const [actividadActiva, setActividadActiva] = useState(actividad?.activo === true || actividad?.activo === "true");
  const [alertaDesactivada, setAlertaDesactivada] = useState(false);
  const [cargandoActividad, setCargandoActividad] = useState(true); // 👈 nuevo

  const boardRef = useRef();
  const socket = useRef(null);
  const IMAGES = actividad?.banco_tangrams || [];

  /// PRUEBAS CHUY
  const [indiceImagen, setIndiceImagen] = useState(0); // Imagen actual
  const [usuariosListos, setUsuariosListos] = useState([]); // Quiénes ya dieron clic
  const [totalUsuarios, setTotalUsuarios] = useState(0); // Total del equipo
  ///
  const [imagenesCapturadas, setImagenesCapturadas] = useState([]);


  // const actividadActiva = actividad?.activo === true || actividad?.activo === "true";
  const reiniciarTablero = () => {
    setBoardPieces([]);
    setPiecesState(PIECES); // Devuelve todas las piezas originales
    setRotation({});        // Reinicia rotación
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      socket.current = new WebSocket(`ws://127.0.0.1:8000/ws/sesiones/${codigoEquipo}/`);
  
      socket.current.onopen = () => {
        console.log("Conectado al WebSocket del equipo:", teamId);
      
        // 🔥 Primero resetea localmente
        setIndiceImagen(0);
        setUsuariosListos([]);
        setImagenesCapturadas([]);
        setIsPlaying(false);
        reiniciarTablero();
      
        // 🔥 Luego manda mensaje al servidor para reiniciar allá también
        socket.current.send(
          JSON.stringify({
            tipo: "reiniciar_sesion",
            nickname: nickname,
            teamId: teamId,
          })
        );
      };
      
      
  
      socket.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
  
        if (data.tipo === "actualizar_tangram") {
          const nuevasPiezas = data.estado.pieces;
          setBoardPieces(nuevasPiezas);
          setRotation(data.estado.rotation);
  
          const idsEnTablero = nuevasPiezas.map((p) => p.id);
          setPiecesState((prev) => prev.filter((p) => !idsEnTablero.includes(p.id)));
  
        } else if (data.tipo === "pieza_bloqueada") {
          setBloqueadas((prev) => ({
            ...prev,
            [data.pieza_id]: data.usuario,
          }));
          setMovingBy(data.usuario);
  
        } else if (data.tipo === "pieza_liberada") {
          setBloqueadas((prev) => {
            const nuevo = { ...prev };
            delete nuevo[data.pieza_id];
            return nuevo;
          });
          setMovingBy(null);
  
        } else if (data.tipo === "usuario_listo") {
          setUsuariosListos(data.usuarios_listos);
  
          // Verifica si todos los usuarios están listos
          const totalListos = data.usuarios_listos.length;
          if (totalListos === totalUsuarios) {
            console.log("✅ Todos los usuarios están listos. Enviando cambio de imagen...");
  
            // Solo uno envía el cambio de imagen
            socket.current?.send(
              JSON.stringify({
                tipo: "cambiar_imagen",
                nuevo_indice: indiceImagen + 1,
              })
            );
          }
  
        } else if (data.tipo === "cambiar_imagen") {
          const nuevoIndice = data.nuevo_indice;
          setIndiceImagen(nuevoIndice);
          setUsuariosListos([]);
          reiniciarTablero();
  
          const total = IMAGES.length;
          const restantes = total - (nuevoIndice + 1);
  
          console.log(`📸 Imagen actual: ${nuevoIndice + 1} de ${total}`);
          console.log(`🧩 Quedan ${restantes} imágenes por mostrar.`);
        }
      };
    }, 100);
  
    return () => {
      clearTimeout(timeout);
      if (socket.current) socket.current.close();
    };
  }, [teamId]);
  

  const handleFinalizar = async () => {
    if (!boardRef.current) return; // Primero verifica que exista el tablero
  
    try {
      // 🔥 1. Capturar la imagen actual antes de finalizar
      const canvas = await html2canvas(boardRef.current);
      const dataUrl = canvas.toDataURL("image/png");
  
      // 🔥 2. Agregar la última imagen a las capturas
      const imagenesAEnviar = [...imagenesCapturadas, dataUrl];
  
      if (imagenesAEnviar.length === 0) {
        alert("No hay imágenes que enviar.");
        return;
      }
  
      // 🔥 3. Ahora sí envía todas las imágenes (incluyendo la nueva)
      const response = await fetch("http://127.0.0.1:8000/evidencias/api/crear_evidencia/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          actividad_id: actividad.id,
          equipo_id: teamId,
          imagenes: imagenesAEnviar, // ⬅️ enviamos el nuevo arreglo actualizado
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("✅ Evidencia enviada:", data);
        alert("Evidencia enviada con éxito 🎉");
  
        setImagenesCapturadas([]); // Limpia las capturas
        reiniciarTablero();        // Limpia el tablero
      } else {
        console.error("❌ Error al guardar evidencia:", data);
        alert("Ocurrió un error al enviar la evidencia.");
      }
    } catch (error) {
      console.error("❌ Error de conexión:", error);
      alert("Error de conexión con el servidor.");
    }
  };
  

  // Intervalo para verificar si la actividad sigue activa
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/actividades/api/actividad_activa_por_equipo/${codigoEquipo}/`);
        const data = await res.json();
          
        if (!data.id || data.activo !== true) {
          setActividadActiva(false);
          setAlertaDesactivada(true);
        } else {
          setActividadActiva(true);
          setAlertaDesactivada(false);
        }
      } catch (err) {
        setActividadActiva(false);
        setAlertaDesactivada(true);
      } finally {
        setCargandoActividad(false); // 👈 ya se terminó de cargar
      }
    }, 5000);
    console.log("📦 Actividad activa desde localStorage:", actividad);
    console.log("🖼️ Imágenes ligadas a la actividad:", actividad?.banco_tangrams);
    return () => clearInterval(interval);
  }, [codigoEquipo]);
  

      /// PRUEBA CHUY ///
      useEffect(() => {
        // Obtener cantidad de usuarios del equipo desde localStorage
        const cantidad = localStorage.getItem("cantidadEstudiantes");
      
        if (cantidad) {
          setTotalUsuarios(parseInt(cantidad));
        }
      }, []);
      ///
  


  // Redirección automática cuando la actividad es desactivada
  useEffect(() => {
    if (!actividadActiva && alertaDesactivada) {
      setTimeout(() => navigate("/components/students/loginStudent", { replace: true }), 3000);
    }
  }, [actividadActiva, alertaDesactivada, navigate]);

  const handleReady = () => setIsPlaying(true);

  if (cargandoActividad) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h2 className="text-2xl text-blue-600 font-bold text-center">
          Cargando actividad...
        </h2>
      </div>
    );
  }
  
  if (!actividadActiva && alertaDesactivada) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h2 className="text-2xl text-red-600 font-bold text-center">
          La actividad fue desactivada por el profesor. Serás redirigido...
        </h2>
      </div>
    );
  }
  

  // const handleReady = () => setIsPlaying(true);

const handleDragStart = (e, id) => {
    if (!isPlaying) return;
    e.dataTransfer.setData("id", id.toString());
    setDraggingPiece(id);

    setMovingBy(nickname);

    socket.current?.send(
      JSON.stringify({
        tipo: "bloquear_pieza",
        pieza_id: id,
        usuario: nickname,
      })
    );
  };

  const handleDrag = (e) => {
    if (!isPlaying || draggingPiece === null) return;
    const boardRect = boardRef.current.getBoundingClientRect();
    const newX = e.clientX - boardRect.left - 40;
    const newY = e.clientY - boardRect.top - 40;

    setBoardPieces((prev) =>
      prev.map((p) => (p.id === draggingPiece ? { ...p, x: newX, y: newY } : p))
    );
  };

  const handleDragEnd = () => {
    if (!isPlaying || draggingPiece === null) return;

    const boardRect = boardRef.current.getBoundingClientRect();

    setBoardPieces((prev) =>
      prev.map((p) => {
        if (p.id === draggingPiece) {
          const isOutside =
            p.x < 0 || p.y < 0 || p.x > boardRect.width - 80 || p.y > boardRect.height - 80;

          if (isOutside) {
            return {
              ...p,
              x: boardRect.width / 2 - 40,
              y: boardRect.height / 2 - 40,
            };
          }
        }
        return p;
      })
    );

    socket.current?.send(
      JSON.stringify({
        tipo: "liberar_pieza",
        pieza_id: draggingPiece,
      })
    );

    setDraggingPiece(null);
    setMovingBy(null);
  };

  const handleDrop = (e) => {
    if (!isPlaying) return;
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData("id"));
    const piece = piecesState.find((p) => p.id === id) || boardPieces.find((p) => p.id === id);
    if (!piece) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const newX = e.clientX - boardRect.left - 40;
    const newY = e.clientY - boardRect.top - 40;

    if (
      newX >= 0 &&
      newX <= boardRect.width - 80 &&
      newY >= 0 &&
      newY <= boardRect.height - 80
    ) {
      const nuevaPieza = { ...piece, x: newX, y: newY };
      const nuevasPiezas = [...boardPieces.filter((p) => p.id !== id), nuevaPieza];
      setBoardPieces(nuevasPiezas);
      setPiecesState((prev) => prev.filter((p) => p.id !== id));

      socket.current?.send(
        JSON.stringify({
          tipo: "actualizar_tangram",
          estado: {
            pieces: nuevasPiezas,
            rotation,
          },
        })
      );
    }
  };

  const handleDragOver = (e) => e.preventDefault();

    /// PARTE DE CHUY ///
    const handleListoParaAvanzar = async () => {
      if (!boardRef.current) return;
    
      // 1. Limpiar bordes/sombras para que la captura salga bonita
      const originalBoxShadow = boardRef.current.style.boxShadow;
      const originalBorder = boardRef.current.style.border;
    
      boardRef.current.style.boxShadow = "none";
      boardRef.current.style.border = "none";
    
      // 2. Capturar imagen limpia
      const canvas = await html2canvas(boardRef.current);
      const dataUrl = canvas.toDataURL("image/png");
    
      // 3. Restaurar estilos originales
      boardRef.current.style.boxShadow = originalBoxShadow;
      boardRef.current.style.border = originalBorder;
    
      // 4. Guardar en lista de capturas acumuladas
      setImagenesCapturadas((prev) => [...prev, dataUrl]);
    
      // 5. Verificar si ya es la última imagen
      if (indiceImagen === IMAGES.length - 1) {
        alert("¡Actividad finalizada!");
        await handleFinalizar();
        setIsPlaying(false);
        return;
      }
    
      // 6. Notificar al WebSocket que este jugador está listo
      socket.current?.send(
        JSON.stringify({
          tipo: "usuario_listo",
          usuario: nickname,
        })
      );
    };
    
    ///

    

  const handleRotate = (id) => {
    if (!isPlaying) return;
    const nuevaRotacion = {
      ...rotation,
      [id]: (rotation[id] || 0) + 45,
    };
    setRotation(nuevaRotacion);

    socket.current?.send(
      JSON.stringify({
        tipo: "actualizar_tangram",
        estado: {
          pieces: boardPieces,
          rotation: nuevaRotacion,
        },
      })
    );
  };

  if (!actividadActiva) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h2 className="text-2xl text-red-600 font-bold text-center">
          No hay una actividad activa disponible en este momento.
        </h2>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="w-1/6 bg-yellow-200 p-4 flex flex-col items-center space-y-4 rounded-tr-3xl rounded-br-3xl shadow-xl">
        <h2 className="text-xl font-bold text-pink-600 mb-2 font-comic">Piezas</h2>
        {piecesState.map((piece) => {
          const estaBloqueada = bloqueadas[piece.id];
          return (
            <div key={`pieza-${piece.id}`} className="relative">
              <img
                src={piece.image}
                alt={`Tangram piece ${piece.id}`}
                className={`w-20 h-20 cursor-pointer rounded-xl transition-transform ${
                  isPlaying ? "opacity-100" : "opacity-40"
                } ${estaBloqueada ? "opacity-30 grayscale" : "hover:scale-110"}`}
                draggable={isPlaying && !estaBloqueada}
                onDragStart={(e) => handleDragStart(e, piece.id)}
              />
              {estaBloqueada && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs text-red-700 font-bold pointer-events-none">
                  Ocupado
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        ref={boardRef}
        className="flex-1 relative bg-white border-4 border-blue-300 rounded-3xl m-4 p-4 shadow-2xl"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        {isPlaying ? (
          <>
            <h1 className="text-2xl font-bold text-center mb-4 text-purple-700 font-comic animate-bounce">
              ¡A Jugar!
            </h1>
            
           <div className="absolute top-4 left-1/2 transform -translate-x-1/2 mt-8 bg-white p-2 rounded-xl shadow text-center z-50">
              <p className="text-sm font-semibold text-purple-800">
                Figura {indiceImagen + 1} de {IMAGES.length}
              </p>
              {IMAGES[indiceImagen] && (
                <img
                  src={IMAGES[indiceImagen]}
                  alt={`Tangram ${indiceImagen + 1}`}
                  className="w-24 h-24 mx-auto mt-1 border border-green-300 rounded"
                />
              )}
            </div>

          </>
        ) : (
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-blue-800 mb-2 font-comic">
              ¡Bienvenido a la actividad! Recrea esta figura:
            </h2>
  {/* //// PARTE DE CHUY //// */}
  {IMAGES.length > 0 && indiceImagen < IMAGES.length ? (
              <img
                src={IMAGES[indiceImagen]}
                alt={`Tangram ${indiceImagen + 1}`}
                className="w-64 h-64 border-4 border-green-400 rounded-xl"
              />
            ) : (
              <p className="text-red-500 font-bold">No hay imagen disponible.</p>
            )}

            <button
                  onClick={handleReady}
                  disabled={IMAGES.length === 0}
                  className={`mt-4 px-6 py-3 text-white text-lg font-bold rounded-full shadow-lg transition ${
                    IMAGES.length > 0 ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Estoy Listo!
            </button>

          </div>
        )}

        {boardPieces.map((piece) => {
          const estaSiendoMovida = bloqueadas[piece.id];
          return (
            <div
              key={`pieza-tablero-${piece.id}`}
              draggable={isPlaying}
              onDragStart={(e) => handleDragStart(e, piece.id)}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => handleRotate(piece.id)}
              style={{
                position: "absolute",
                left: piece.x,
                top: piece.y,
                transform: `rotate(${rotation[piece.id] || 0}deg)`,
                cursor: "grab",
              }}
            >
              <img
                src={piece.image}
                alt={`Tangram piece ${piece.id}`}
                className="w-20 h-20 rounded-lg transition-transform hover:scale-105"
              />
              {estaSiendoMovida && (
                <div className="absolute top-0 left-20 bg-black bg-opacity-70 text-white text-[10px] px-2 py-1 rounded z-50 pointer-events-none whitespace-nowrap">
                  {estaSiendoMovida}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="w-1/3 bg-pink-100 border-l-4 border-pink-300 p-4 rounded-tl-3xl rounded-bl-3xl shadow-xl">
        <h2 className="text-xl font-bold text-center text-pink-700 mb-2 font-comic">
         Chat del Equipo
        </h2>
        <ChatRoom teamId={teamId} />

        {isPlaying && (
    <button
      onClick={handleListoParaAvanzar}
      disabled={usuariosListos.includes(nickname)}
      className={`mt-6 px-6 py-3 text-white text-lg font-bold rounded-full shadow-lg transition ${
        usuariosListos.includes(nickname)
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {indiceImagen === IMAGES.length - 1 ? "Finalizar" : "Siguiente"}
    </button>
  )}
  {usuariosListos.length > 0 && (
  <div className="mt-2 flex flex-wrap justify-center gap-2">
    {usuariosListos.map((user, index) => (
      <span
        key={index}
        className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
      >
        ✅ {user}
      </span>
    ))}
  </div>
)}

</div>
      
    </div>
  );
};

export default Board;