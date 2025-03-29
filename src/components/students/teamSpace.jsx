import { useNavigate } from "react-router-dom";

function TeamSpace({ nickname, teamCode }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800">Bienvenido, {nickname}!</h1>
      <p className="text-lg text-gray-600 mt-2">Estás en el equipo: <strong>{teamCode}</strong></p>
      <button 
        className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        onClick={() => navigate("./components/students/loginStudent")}
      >
        Salir
      </button>
    </div>
  );
}

export default TeamSpace;

  

// import { useState, useEffect } from "react";

// function TeamSpace({ nickname, teamCode }) {
//   const [pieces, setPieces] = useState([
//     { id: 1, position: { x: 50, y: 50 } },
//     { id: 2, position: { x: 150, y: 50 } },
//     { id: 3, position: { x: 250, y: 50 } },
//   ]);

//   useEffect(() => {
//     const socket = new WebSocket(`ws://localhost:8000/ws/tangram/${teamCode}/`);

//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       setPieces(data.pieces);
//     };

//     return () => socket.close();
//   }, [teamCode]);

//   const movePiece = (id, newPosition) => {
//     const updatedPieces = pieces.map((piece) =>
//       piece.id === id ? { ...piece, position: newPosition } : piece
//     );

//     setPieces(updatedPieces);
//     fetch(`ws://localhost:8000/ws/tangram/${teamCode}/`, {
//       method: "POST",
//       body: JSON.stringify({ pieces: updatedPieces }),
//     });
//   };

//   return (
//     <div>
//       <h1>Equipo: {teamCode}</h1>
//       <p>Jugador: {nickname}</p>
//       {/* Aquí iría el sistema de Drag & Drop para mover las piezas */}
//     </div>
//   );
// }

// export default TeamSpace;


// import { DndProvider, useDrag, useDrop } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import { useState } from "react";

// const TangramPiece = ({ id, position, movePiece }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: "TANGRAM",
//     item: { id },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   }));

//   return (
//     <div
//       ref={drag}
//       className="w-16 h-16 bg-blue-500 rounded-lg absolute cursor-pointer"
//       style={{
//         left: position.x,
//         top: position.y,
//         opacity: isDragging ? 0.5 : 1,
//       }}
//     />
//   );
// };

// const Board = ({ pieces, movePiece }) => {
//   const [, drop] = useDrop(() => ({
//     accept: "TANGRAM",
//     drop: (item, monitor) => {
//       const offset = monitor.getSourceClientOffset();
//       if (offset) {
//         movePiece(item.id, { x: offset.x, y: offset.y });
//       }
//     },
//   }));

//   return (
//     <div ref={drop} className="relative w-full h-full bg-gray-200 border-2 border-black">
//       {pieces.map((piece) => (
//         <TangramPiece key={piece.id} id={piece.id} position={piece.position} movePiece={movePiece} />
//       ))}
//     </div>
//   );
// };

// const TeamSpace = ({ nickname, teamCode }) => {
//   const [pieces, setPieces] = useState([
//     { id: 1, position: { x: 50, y: 50 } },
//     { id: 2, position: { x: 150, y: 50 } },
//     { id: 3, position: { x: 250, y: 50 } },
//   ]);

//   const movePiece = (id, newPosition) => {
//     setPieces((prev) =>
//       prev.map((piece) =>
//         piece.id === id ? { ...piece, position: newPosition } : piece
//       )
//     );
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//         <h1 className="text-3xl font-bold text-gray-700">Equipo: {teamCode}</h1>
//         <p className="text-lg text-gray-600">Jugador: {nickname}</p>

//         <div className="w-[400px] h-[400px] border-2 border-black mt-4 relative">
//           <Board pieces={pieces} movePiece={movePiece} />
//         </div>

//         <div className="mt-4">
//           <button className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg">
//             Enviar Solución
//           </button>
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// export default TeamSpace;
