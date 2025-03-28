
// /////
// import React, { useState, useRef } from "react";
// import ChatRoom from "./chat/chatRoom";
// import casaTangram from "../../assets/casa_tangram.png";

// // Imágenes de las piezas
// import SquareSVG from "../../assets/cuadrado_rojo.png";
// import ParallelogramSVG from "../../assets/trapecio_azul.png";
// import TriangleYellowSVG from "../../assets/triangulo_amarillo.png";
// import TriangleBlueSVG from "../../assets/triangulo_azul.png";
// import TrianglePurpleSVG from "../../assets/triangulo_morado.png";
// import TrianglePinkSVG from "../../assets/triangulo_rosa.png";
// import TriangleGreenSVG from "../../assets/triangulo_verde.png";

// const IMAGES = [{ id: 1, url: casaTangram }];

// const PIECES = [
//   { id: 0, image: TriangleYellowSVG },
//   { id: 1, image: TriangleBlueSVG },
//   { id: 2, image: TrianglePurpleSVG },
//   { id: 3, image: TrianglePinkSVG },
//   { id: 4, image: TriangleGreenSVG },
//   { id: 5, image: SquareSVG },
//   { id: 6, image: ParallelogramSVG },
// ];

// const Board = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [piecesState, setPiecesState] = useState(PIECES);
//   const [boardPieces, setBoardPieces] = useState([]);
//   const [rotation, setRotation] = useState({});
//   const boardRef = useRef();

//   const handleReady = () => setIsPlaying(true);

//   const handleDragStart = (e, id) => {
//     e.dataTransfer.setData("id", id.toString());
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const id = parseInt(e.dataTransfer.getData("id"));
//     const piece = piecesState.find((p) => p.id === id) || boardPieces.find((p) => p.id === id);
//     if (!piece) return;

//     const boardRect = boardRef.current.getBoundingClientRect();
//     const newX = e.clientX - boardRect.left - 32;
//     const newY = e.clientY - boardRect.top - 32;

//     if (
//       newX >= 0 && newX <= boardRect.width - 64 &&
//       newY >= 0 && newY <= boardRect.height - 64
//     ) {
//       setBoardPieces((prev) => [
//         ...prev.filter((p) => p.id !== id),
//         { ...piece, x: newX, y: newY },
//       ]);
//       setPiecesState((prev) => prev.filter((p) => p.id !== id));
//     }
//   };

//   const handleDragOver = (e) => e.preventDefault();

//   const handleRotate = (id) => {
//     setRotation((prev) => ({
//       ...prev,
//       [id]: (prev[id] || 0) + 90,
//     }));
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Contenedor de piezas */}
//       <div className="w-1/6 bg-gray-200 p-4 flex flex-col items-center space-y-4">
//         <h2 className="text-lg font-bold">Piezas</h2>
//         {piecesState.map((piece) => (
//           <div key={piece.id} className="relative">
//             <img
//               src={piece.image}
//               alt={`Tangram piece ${piece.id}`}
//               className="w-16 h-16 cursor-pointer"
//               draggable="true"
//               onDragStart={(e) => handleDragStart(e, piece.id)}
//               style={{ transform: `rotate(${rotation[piece.id] || 0}deg)` }}
//             />
//             <button
//               onClick={() => handleRotate(piece.id)}
//               className="absolute top-0 right-0 text-black p-1 rounded-full"
//             >
//               ↻
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Tablero de Tangram */}
//       <div
//         ref={boardRef}
//         className="flex-1 relative bg-gray-100 shadow-md border border-gray-300 rounded-md overflow-hidden p-4"
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//       >
//         {isPlaying ? (
//           <h1 className="text-xl font-bold text-center mb-4">Tangram Board</h1>
//         ) : (
//           <div className="flex flex-col items-center">
//             <h2 className="text-lg font-bold">Recrea esta imagen:</h2>
//             <img src={IMAGES[0].url} alt="Tangram objetivo" className="w-64 h-64 border" />
//             <button onClick={handleReady} className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg">
//               ¡Listo!
//             </button>
//           </div>
//         )}

//         {/* Renderizar las piezas en el tablero */}
//         {boardPieces.map((piece) => (
//           <div
//             key={piece.id}
//             draggable="true"
//             onDragStart={(e) => handleDragStart(e, piece.id)}
//             onDrop={handleDrop}
//             onDragOver={handleDragOver}
//             style={{
//               position: "absolute",
//               left: piece.x,
//               top: piece.y,
//               transform: `rotate(${rotation[piece.id] || 0}deg)`,
//             }}
//           >
//             <img src={piece.image} alt={`Tangram piece ${piece.id}`} className="w-16 h-16 cursor-pointer" />
//             <button
//               onClick={() => handleRotate(piece.id)}
//               className="absolute top-0 right-0  text-black p-1 rounded-full"
//             >
//               ↻
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Chat lateral */}
//       <div className="w-1/3 bg-white border-l border-gray-300 p-4">
//         <ChatRoom teamId={1} />
//       </div>
//     </div>
//   );
// };

// export default Board;

import React, { useState, useRef } from "react";
import ChatRoom from "./chat/chatRoom";
import casaTangram from "../../assets/casa_tangram.png";

// Imágenes de las piezas
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
  const boardRef = useRef();

  const handleReady = () => setIsPlaying(true);

  const handleDragStart = (e, id) => {
    if (!isPlaying) return; // ❌ No permite arrastrar si no ha comenzado el juego
    e.dataTransfer.setData("id", id.toString());
  };

  const handleDrop = (e) => {
    if (!isPlaying) return; // ❌ No permite soltar piezas si no ha comenzado el juego
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData("id"));
    const piece = piecesState.find((p) => p.id === id) || boardPieces.find((p) => p.id === id);
    if (!piece) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const newX = e.clientX - boardRect.left - 32;
    const newY = e.clientY - boardRect.top - 32;

    if (
      newX >= 0 && newX <= boardRect.width - 64 &&
      newY >= 0 && newY <= boardRect.height - 64
    ) {
      setBoardPieces((prev) => [
        ...prev.filter((p) => p.id !== id),
        { ...piece, x: newX, y: newY },
      ]);
      setPiecesState((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleRotate = (id) => {
    if (!isPlaying) return; // ❌ No permite rotar si no ha comenzado el juego
    setRotation((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 90,
    }));
  };

  return (
    <div className="flex h-screen">
      {/* Contenedor de piezas */}
      <div className="w-1/6 bg-gray-200 p-4 flex flex-col items-center space-y-4">
        <h2 className="text-lg font-bold">Piezas</h2>
        {piecesState.map((piece) => (
          <div key={piece.id} className="relative">
            <img
              src={piece.image}
              alt={`Tangram piece ${piece.id}`}
              className={`w-16 h-16 cursor-pointer ${isPlaying ? "opacity-100" : "opacity-50"}`}
              draggable={isPlaying}
              onDragStart={(e) => handleDragStart(e, piece.id)}
              style={{ transform: `rotate(${rotation[piece.id] || 0}deg)` }}
            />
            {isPlaying && (
              <button
                onClick={() => handleRotate(piece.id)}
                className="absolute top-0 right-0 text-black p-1 rounded-full"
              >
                ↻
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Tablero de Tangram */}
      <div
        ref={boardRef}
        className="flex-1 relative bg-gray-100 shadow-md border border-gray-300 rounded-md overflow-hidden p-4"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {isPlaying ? (
          <h1 className="text-xl font-bold text-center mb-4">Tangram Board</h1>
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold">Recrea esta imagen:</h2>
            <img src={IMAGES[0].url} alt="Tangram objetivo" className="w-64 h-64 border" />
            <button onClick={handleReady} className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg">
              ¡Listo!
            </button>
          </div>
        )}

        {/* Renderizar las piezas en el tablero */}
        {boardPieces.map((piece) => (
          <div
            key={piece.id}
            draggable={isPlaying}
            onDragStart={(e) => handleDragStart(e, piece.id)}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{
              position: "absolute",
              left: piece.x,
              top: piece.y,
              transform: `rotate(${rotation[piece.id] || 0}deg)`,
            }}
          >
            <img src={piece.image} alt={`Tangram piece ${piece.id}`} className="w-16 h-16 cursor-pointer" />
            {isPlaying && (
              <button
                onClick={() => handleRotate(piece.id)}
                className="absolute top-0 right-0  text-black p-1 rounded-full"
              >
                ↻
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Chat lateral */}
      <div className="w-1/3 bg-white border-l border-gray-300 p-4">
        <ChatRoom teamId={1} />
      </div>
    </div>
  );
};

export default Board;
