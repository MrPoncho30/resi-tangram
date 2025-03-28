// import React, { useEffect, useState } from "react";

// const ChatRoom = ({ teamId }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     // Conectar al WebSocket del servidor de prueba
//     const ws = new WebSocket("ws://localhost:8080");

//     ws.onopen = () => {
//       console.log("Conectado al servidor WebSocket");
//     };

//     ws.onmessage = (event) => {
//       const data = event.data;
//       setMessages((prevMessages) => [...prevMessages, data]);
//     };

//     setSocket(ws);

//     return () => {
//       ws.close(); // Cerrar la conexión al salir
//     };
//   }, []);

//   const sendMessage = () => {
//     if (newMessage.trim()) {
//       socket.send(newMessage); // Enviar mensaje al WebSocket
//       setNewMessage("");
//     }
//   };

//   return (
//     <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-lg p-4">
//       <h2 className="text-2xl font-semibold text-center mb-4">Chat de Equipo</h2>

//       {/* Área de mensajes */}
//       <div className="flex-1 overflow-y-auto p-2 mb-4 bg-gray-100 rounded-lg max-h-[400px]">
//         {messages.map((message, index) => (
//           <div key={index} className="mb-2 p-2 bg-gray-200 rounded-md">
//             {message}
//           </div>
//         ))}
//       </div>

//       {/* Campo de entrada de mensaje */}
//       <div className="flex items-center space-x-2">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Escribe un mensaje..."
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <button
//           onClick={sendMessage}
//           className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
//         >
//           Enviar
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatRoom;

// import React, { useState } from "react";

// const ChatRoom = () => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   const sendMessage = () => {
//     if (newMessage.trim()) {
//       setMessages((prevMessages) => [...prevMessages, { text: newMessage, sender: "Yo" }]);
//       setNewMessage(""); // Limpiar input
//     }
//   };

//   return (
//     <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-lg p-4">
//       <h2 className="text-2xl font-semibold text-center mb-4">Chat de Equipo (Simulación)</h2>

//       <div className="flex-1 overflow-y-auto p-2 mb-4 bg-gray-100 rounded-lg max-h-[400px]">
//         {messages.map((msg, index) => (
//           <div key={index} className="mb-2 p-2 bg-gray-200 rounded-md">
//             <span className="font-bold">{msg.sender}: </span>{msg.text}
//           </div>
//         ))}
//       </div>

//       <div className="flex items-center space-x-2">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Escribe un mensaje..."
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <button
//           onClick={sendMessage}
//           className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
//         >
//           Enviar
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatRoom;

// import React, { useState } from "react";
// import useWebSocket from "react-use-websocket";

// const ChatRoom = () => {
//   const [newMessage, setNewMessage] = useState("");
//   const [messages, setMessages] = useState([]);

//   const { sendJsonMessage, lastMessage, readyState } = useWebSocket("ws://127.0.0.1:8000/ws/sesiones/ZH8WRW/", {
//     onOpen: () => console.log("Conectado al servidor WebSocket"),
//     onClose: () => console.log("Desconectado del servidor WebSocket"),
//     onMessage: (event) => {
//       const message = JSON.parse(event.data);
//       setMessages((prevMessages) => [...prevMessages, message]);
//     },
//   });

//   const handleSendMessage = () => {
//     sendJsonMessage({
//       tipo: "chat",
//       usuario: "Pedro",
//       mensaje: "¡Hola equipo desde react-use-websocket!"
//     });
//   };

//   return (
//     <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-lg p-4">
//       <h2 className="text-2xl font-semibold text-center mb-4">Chat de Equipo (ALANGAY)</h2>

//       <div className="flex-1 overflow-y-auto p-2 mb-4 bg-gray-100 rounded-lg max-h-[400px]">
//         {messages.map((msg, index) => (
//           <div key={index} className="mb-2 p-2 bg-gray-200 rounded-md">
//             <span className="font-bold">{msg.sender}: </span>{msg.text}
//           </div>
//         ))}
//       </div>

//       <div className="flex items-center space-x-2">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Escribe un mensaje..."
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <button
//           onClick={handleSendMessage}
//           className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
//         >
//           Enviar
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatRoom;

import React, { useState } from "react";
import useWebSocket from "react-use-websocket";

const ChatRoom = () => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket("ws://127.0.0.1:8000/ws/sesiones/ZH8WRW/", {
    onOpen: () => console.log("Conectado al servidor WebSocket"),
    onClose: () => console.log("Desconectado del servidor WebSocket"),
    onMessage: (event) => {
      const message = JSON.parse(event.data);
      console.log("Mensaje recibido:", message);  
      setMessages((prevMessages) => [...prevMessages, message]);
    },
  });
  

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        tipo: "chat",          
        usuario: "Pedro",      
        mensaje: newMessage,   
      };
  
      // Enviar el mensaje al servidor usando sendJsonMessage
      sendJsonMessage(message);
  
      // Agregar el mensaje a los mensajes del chat en el estado de React
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Yo", text: newMessage }
      ]);
  
      // Limpiar el input después de enviar el mensaje
      setNewMessage("");
    }
  };
  

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-2xl font-semibold text-center mb-4">Chat de Equipo (ALANGAY)</h2>

      <div className="flex-1 overflow-y-auto p-2 mb-4 bg-gray-100 rounded-lg max-h-[400px]">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2 p-2 bg-gray-200 rounded-md">
            <span className="font-bold">{msg.sender}: </span>{msg.text}
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
