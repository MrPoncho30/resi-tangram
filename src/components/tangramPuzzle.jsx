import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";

const Piece = ({ id, shape, color, position, insideBoard, onDrop }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "PIECE",
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Estilo dinámico de las piezas
  const getShapeStyle = (shape) => {
    switch (shape) {
      case "triangle":
        return {
          width: 0,
          height: 0,
          borderLeft: "30px solid transparent",
          borderRight: "30px solid transparent",
          borderBottom: `60px solid ${color}`,
        };
      case "square":
        return {
          width: 60,
          height: 60,
          backgroundColor: color,
        };
      case "parallelogram":
        return {
          width: 80,
          height: 40,
          backgroundColor: color,
          transform: "skewX(-20deg)",
        };
      default:
        return {};
    }
  };

  return (
    <div
      ref={drag}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        ...getShapeStyle(shape),
      }}
    ></div>
  );
};

const TangramBoard = () => {
  const [pieces, setPieces] = useState([
    { id: 1, shape: "triangle", color: "#e63946", position: { x: 250, y: 50 }, insideBoard: false },
    { id: 2, shape: "triangle", color: "#f4a261", position: { x: 320, y: 100 }, insideBoard: false },
    { id: 3, shape: "triangle", color: "#2a9d8f", position: { x: 250, y: 150 }, insideBoard: false },
    { id: 4, shape: "triangle", color: "#457b9d", position: { x: 320, y: 200 }, insideBoard: false },
    { id: 5, shape: "triangle", color: "#8ecae6", position: { x: 250, y: 250 }, insideBoard: false },
    { id: 6, shape: "square", color: "#e76f51", position: { x: 320, y: 300 }, insideBoard: false },
    { id: 7, shape: "parallelogram", color: "#a8dadc", position: { x: 250, y: 350 }, insideBoard: false },
  ]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "PIECE",
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      setPieces((prevPieces) =>
        prevPieces.map((p) =>
          p.id === item.id
            ? {
                ...p,
                position: {
                  x: p.position.x + delta.x,
                  y: p.position.y + delta.y,
                },
                insideBoard: true,
              }
            : p
        )
      );
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Temporizador
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
    return () => clearInterval(interval); 
  }, []);

  const formatTime = (time) => {
    const hours = String(Math.floor(time / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div style={{ backgroundColor: "#1e3a8a", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: "80%",
          height: "80%",
          backgroundColor: "#ffffff",
          borderRadius: "15px",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between", 
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            color: "blue",
            fontSize: "2rem",
            fontWeight: "bold",
            zIndex: 10, 
          }}
        >
          {formatTime(time)}
        </div>

        <div style={{ width: "30%", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          {pieces
            .filter((piece) => !piece.insideBoard)
            .map((piece) => (
              <Piece key={piece.id} {...piece} />
            ))}
        </div>

        <div
          ref={drop}
          style={{
            width: "60%",
            height: "100%",
            backgroundColor: "#e5e5e5",
            border: "2px solid #aaa",
            position: "relative",
            marginLeft: "20px",
          }}
        >
          {pieces
            .filter((piece) => piece.insideBoard) 
            .map((piece) => (
              <Piece key={piece.id} {...piece} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default TangramBoard;
