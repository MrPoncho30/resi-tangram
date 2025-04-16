import React, { useState, useEffect, useRef } from "react";
import ChatRoom from "./chat/chatRoom";
import casaTangram from "../../assets/casa_tangram.png";

import SquareSVG from "../../assets/cuadrado_rojo.png";
import ParallelogramSVG from "../../assets/trapecio_azul.png";
import TriangleYellowSVG from "../../assets/triangulo_amarillo.png";
import TriangleBlueSVG from "../../assets/triangulo_azul.png";
import TrianglePurpleSVG from "../../assets/triangulo_morado.png";
import TrianglePinkSVG from "../../assets/triangulo_rosa.png";
import TriangleGreenSVG from "../../assets/triangulo_verde.png";

const IMAGES = [{ id: 1, url: casaTangram }];
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [piecesState, setPiecesState] = useState(PIECES);
  const [boardPieces, setBoardPieces] = useState([]);
  const [rotation, setRotation] = useState({});
  const [draggingPiece, setDraggingPiece] = useState(null);
  const [bloqueadas, setBloqueadas] = useState({});
  const [movingBy, setMovingBy] = useState(null);
  const [piecesBeingMoved, setPiecesBeingMoved] = useState({}); // { piezaId: nombre }
  const boardRef = useRef();
  const socket = useRef(null);

  const nickname = localStorage.getItem("nickname");
  const studentName = localStorage.getItem("studentName");
  const teamId = localStorage.getItem("teamId");
  const teamName = localStorage.getItem("teamName");

  useEffect(() => {
    const timeout = setTimeout(() => {
      socket.current = new WebSocket(`ws://127.0.0.1:8000/ws/sesiones/ZH8WRW/`);
  
      socket.current.onopen = () => {
        console.log("✅ Conectado al WebSocket del equipo:", teamId);
      };
  
      socket.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
  
        if (data.tipo === "actualizar_tangram") {
          const nuevasPiezas = data.estado.pieces;
          setBoardPieces(nuevasPiezas);
          setRotation(data.estado.rotation);
  
          const idsEnTablero = nuevasPiezas.map((p) => p.id);
          setPiecesState((prev) => prev.filter((p) => !idsEnTablero.includes(p.id)));
        }
  
        else if (data.tipo === "pieza_bloqueada") {
          setBloqueadas((prev) => ({
            ...prev,
            [data.pieza_id]: data.usuario,
          }));
          setMovingBy(data.usuario); // 👈 Mostrar quién está moviendo
        }
  
        else if (data.tipo === "pieza_liberada") {
          setBloqueadas((prev) => {
            const nuevo = { ...prev };
            delete nuevo[data.pieza_id];
            return nuevo;
          });
          setMovingBy(null); // 👈 Limpiar mensaje al soltar
        }
      };
    }, 100);
  
    return () => {
      clearTimeout(timeout);
      if (socket.current) socket.current.close();
    };
  }, [teamId]);
  

  const handleReady = () => setIsPlaying(true);

  const handleDragStart = (e, id) => {
    if (!isPlaying) return;
    e.dataTransfer.setData("id", id.toString());
    setDraggingPiece(id);

    setMovingBy(nickname); //ESTO DEBE MOSTRAR A TU PUTA MADRE QUE LA ESTA MOVIENDO

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
    const piece =
      piecesState.find((p) => p.id === id) || boardPieces.find((p) => p.id === id);
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

  console.log("Estas jugando como:", { studentName }, { nickname }, "Equipo: ID:", {
    teamId,
  }, "Nombre Eq: ", { teamName });

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      {/* Contenedor de piezas */}
      <div className="w-1/6 bg-yellow-200 p-4 flex flex-col items-center space-y-4 rounded-tr-3xl rounded-br-3xl shadow-xl">
        <h2 className="text-xl font-bold text-pink-600 mb-2 font-comic">🧩 Piezas</h2>
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

      {/* Tablero */}
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
          {/* {movingBy && (
            <div className="absolute top-0 left-0 w-full text-center text-lg font-bold text-blue-700">
              <p>{movingBy} ESTA MOVIENDO A TU PUTA MADRE DE PIEZA</p>
            </div>
          )} */}
          </>
        ) : (
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-blue-800 mb-2 font-comic">
              🎯 Recrea esta figura:
            </h2>
            <img
              src={IMAGES[0].url}
              alt="Tangram objetivo"
              className="w-64 h-64 border-4 border-green-400 rounded-xl"
            />
            <button
              onClick={handleReady}
              className="mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white text-lg font-bold rounded-full shadow-lg transition"
            >
              ¡Estoy Listo! 🚀
            </button>
          </div>
        )}

        {/* Renderizar piezas en el tablero */}
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

      {/* Chat */}
      <div className="w-1/3 bg-pink-100 border-l-4 border-pink-300 p-4 rounded-tl-3xl rounded-bl-3xl shadow-xl">
        <h2 className="text-xl font-bold text-center text-pink-700 mb-2 font-comic">
          💬 Chat del Equipo
        </h2>
        <ChatRoom teamId={teamId} />
      </div>
    </div>
  );
};

export default Board;
