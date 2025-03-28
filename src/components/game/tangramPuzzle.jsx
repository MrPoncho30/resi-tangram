import React, { useState } from "react";
import Draggable from "react-draggable";

const pieces = [
  { id: 1, points: "0,0 100,0 50,50", color: "red", cx: 50, cy: 25 },
  { id: 2, points: "0,0 50,50 0,100", color: "blue", cx: 25, cy: 50 },
  { id: 3, points: "50,50 100,100 100,50", color: "green", cx: 75, cy: 75 },
  { id: 4, points: "0,100 50,50 100,100", color: "yellow", cx: 50, cy: 75 },
  { id: 5, points: "50,50 75,75 50,100", color: "purple", cx: 62.5, cy: 75 },
  { id: 6, points: "75,75 100,50 100,100", color: "orange", cx: 87.5, cy: 75 },
  { id: 7, points: "0,0 50,50 100,0", color: "cyan", cx: 50, cy: 25 },
];

export default function TangramGame() {
  const [rotations, setRotations] = useState({});
  const [positions, setPositions] = useState({});

  const rotatePiece = (id) => {
    setRotations((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 45,
    }));
  };

  const resetTangram = () => {
    setRotations({});
    setPositions({});
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">🧩 Juego de Tangram</h1>
      <button
        onClick={resetTangram}
        className="mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        Reiniciar
      </button>
      <div className="w-96 h-96 bg-white border-4 border-gray-800 flex items-center justify-center relative">
        <svg width="400" height="400" viewBox="0 0 200 200">
          {pieces.map((piece) => (
            <Draggable
              key={piece.id}
              position={positions[piece.id] || { x: 0, y: 0 }}
              onStop={(_, data) => {
                setPositions((prev) => ({
                  ...prev,
                  [piece.id]: { x: data.x, y: data.y },
                }));
              }}
            >
              <g>
                {/* Figura Tangram */}
                <polygon
                  points={piece.points}
                  fill={piece.color}
                  transform={`rotate(${rotations[piece.id] || 0}, ${piece.cx}, ${piece.cy})`}
                  className="cursor-pointer"
                />
                {/* Flecha de rotación */}
                <g
                  onClick={() => rotatePiece(piece.id)}
                  className="cursor-pointer"
                >
                  {/* Círculo de fondo */}
                  <circle
                    cx={piece.cx + 30}
                    cy={piece.cy}
                    r="8"
                    fill="black"
                  />
                  {/* Flecha curva */}
                  <path
                    d={`M ${piece.cx + 26},${piece.cy - 3} 
                       A 8 8 0 1 1 ${piece.cx + 34},${piece.cy + 3} 
                       L ${piece.cx + 32},${piece.cy - 4} 
                       M ${piece.cx + 34},${piece.cy + 3} 
                       L ${piece.cx + 28},${piece.cy + 2}`}
                    stroke="white"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </g>
              </g>
            </Draggable>
          ))}
        </svg>
      </div>
    </div>
  );
}


// Estilos en un objeto JS
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  board: {
    width: "400px",
    height: "400px",
    backgroundColor: "white",
    border: "2px solid black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  svg: {
    width: "100%",
    height: "100%",
  },
};
