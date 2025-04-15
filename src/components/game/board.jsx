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
  const [socket, setSocket] = useState(null);
  const boardRef = useRef();

  const nickname = localStorage.getItem("nickname");
  const studentName = localStorage.getItem("studentName");
  const teamId = localStorage.getItem("teamId");
  const teamName = localStorage.getItem("teamName");
  const codigoSesion = localStorage.getItem("codigoSesion");

  useEffect(() => {
     const ws = new WebSocket("ws://127.0.0.1:8000/ws/sesiones/ZH8WRW/" );
    setSocket(ws);

    ws.onopen = () => console.log("✅ WebSocket conectado");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.tipo === "actualizar_tangram") {
        console.log("📥 Estado recibido:", data.estado);

        const nuevasPiezas = data.estado.piezas;
        setBoardPieces(nuevasPiezas);

        const nuevasRotaciones = {};
        nuevasPiezas.forEach((pieza) => {
          nuevasRotaciones[pieza.id] = pieza.angulo || 0;
        });
        setRotation(nuevasRotaciones);
      }
    };

    ws.onclose = () => console.log("❌ WebSocket cerrado");

    return () => {
      ws.close();
    };
  }, [codigoSesion]);

  const enviarEstadoTangram = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("⚠️ WebSocket no está listo.");
      return;
    }

    const estado = {
      piezas: boardPieces.map((pieza) => ({
        id: pieza.id,
        x: pieza.x,
        y: pieza.y,
        angulo: rotation[pieza.id] || 0,
        image: pieza.image,
      })),
    };

    const mensaje = {
      tipo: "actualizar_tangram",
      estado,
    };

    console.log("📤 Enviando estado al servidor:", mensaje);
    socket.send(JSON.stringify(mensaje));
  };

  const handleReady = () => setIsPlaying(true);

  const handleDragStart = (e, id) => {
    if (!isPlaying) return;
    e.dataTransfer.setData("id", id.toString());
    setDraggingPiece(id);
  };

  const handleDrag = (e) => {
    if (!isPlaying || draggingPiece === null) return;
    const boardRect = boardRef.current.getBoundingClientRect();
    const newX = e.clientX - boardRect.left - 40;
    const newY = e.clientY - boardRect.top - 40;

    setBoardPieces((prev) =>
      prev.map((p) =>
        p.id === draggingPiece ? { ...p, x: newX, y: newY } : p
      )
    );
  };

  const handleDragEnd = () => {
    if (!isPlaying || draggingPiece === null) return;

    const boardRect = boardRef.current.getBoundingClientRect();

    setBoardPieces((prev) => {
      const updated = prev.map((p) => {
        if (p.id === draggingPiece) {
          const isOutside =
            p.x < 0 ||
            p.y < 0 ||
            p.x > boardRect.width - 80 ||
            p.y > boardRect.height - 80;

          if (isOutside) {
            return {
              ...p,
              x: boardRect.width / 2 - 40,
              y: boardRect.height / 2 - 40,
            };
          }
        }
        return p;
      });

      setTimeout(() => enviarEstadoTangram(), 0);
      return updated;
    });

    setDraggingPiece(null);
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
      newX >= 0 && newX <= boardRect.width - 80 &&
      newY >= 0 && newY <= boardRect.height - 80
    ) {
      const newBoard = [
        ...boardPieces.filter((p) => p.id !== id),
        { ...piece, x: newX, y: newY },
      ];
      setBoardPieces(newBoard);
      setPiecesState((prev) => prev.filter((p) => p.id !== id));

      setTimeout(() => enviarEstadoTangram(), 0);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleRotate = (id) => {
    if (!isPlaying) return;

    setRotation((prev) => {
      const newRot = {
        ...prev,
        [id]: (prev[id] || 0) + 45,
      };
      setTimeout(() => enviarEstadoTangram(), 0);
      return newRot;
    });
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      {/* Contenedor de piezas */}
      <div className="w-1/6 bg-yellow-200 p-4 flex flex-col items-center space-y-4 rounded-tr-3xl rounded-br-3xl shadow-xl">
        <h2 className="text-xl font-bold text-pink-600 mb-2 font-comic">🧩 Piezas</h2>
        {piecesState.map((piece) => (
          <img
            key={piece.id}
            src={piece.image}
            alt={`Tangram piece ${piece.id}`}
            className={`w-20 h-20 cursor-pointer rounded-xl transition-transform hover:scale-110 ${
              isPlaying ? "opacity-100" : "opacity-40"
            }`}
            draggable={isPlaying}
            onDragStart={(e) => handleDragStart(e, piece.id)}
          />
        ))}
      </div>

      {/* Tablero de Tangram */}
      <div
        ref={boardRef}
        className="flex-1 relative bg-white border-4 border-blue-300 rounded-3xl m-4 p-4 shadow-2xl"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        {isPlaying ? (
          <h1 className="text-2xl font-bold text-center mb-4 text-purple-700 font-comic animate-bounce">¡A Jugar!</h1>
        ) : (
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-blue-800 mb-2 font-comic">🎯 Recrea esta figura:</h2>
            <img src={IMAGES[0].url} alt="Tangram objetivo" className="w-64 h-64 border-4 border-green-400 rounded-xl" />
            <button
              onClick={handleReady}
              className="mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white text-lg font-bold rounded-full shadow-lg transition"
            >
              ¡Estoy Listo! 🚀
            </button>
          </div>
        )}

        {/* Renderizar piezas en el tablero */}
        {boardPieces.map((piece) => (
          <div
            key={piece.id}
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
          </div>
        ))}
      </div>

      {/* Chat lateral */}
      <div className="w-1/3 bg-pink-100 border-l-4 border-pink-300 p-4 rounded-tl-3xl rounded-bl-3xl shadow-xl">
        <h2 className="text-xl font-bold text-center text-pink-700 mb-2 font-comic">💬 Chat del Equipo</h2>
        <ChatRoom teamId={teamId} />
      </div>
    </div>
  );
};

export default Board;