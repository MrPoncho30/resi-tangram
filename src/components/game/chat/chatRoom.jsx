import React, { useState, useEffect,useRef } from "react";
import { useLocation } from "react-router-dom";
import useWebSocket from "react-use-websocket";


const ChatRoom = () => {
  const location = useLocation();

  const teamName = location.state?.equipo?.nombre_equipo;
  const codigoEquipo = location.state?.teamCode || location.state?.codigoEquipo || localStorage.getItem("teamCode");
  const nickname = location.state?.nickname;

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [replyToIndex, setReplyToIndex] = useState(null);
  const messagesEndRef = useRef(null);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    `ws://127.0.0.1:8000/ws/sesiones/${codigoEquipo}/`,
    {
      onOpen: () => {
        console.log("Conectado al WebSocket");
        // 🔥 Solicita historial de chat al servidor
        sendJsonMessage({
          tipo: "solicitar_historial_chat",
          teamId: codigoEquipo,
        });
      },
      onClose: () => console.log("Desconectado del WebSocket"),
      shouldReconnect: () => true, // 🔄 Reintentar conexión automática
    }
  );

  useEffect(() => {
    if (!lastJsonMessage) return;

    const message = lastJsonMessage;

    console.log("📩 Mensaje recibido del WebSocket:", message);

    if (message.tipo === "chat" && message.usuario && message.mensaje) {
      console.log("🗨️ Nuevo mensaje de chat:");
      console.log("De:", message.usuario);
      console.log("Mensaje:", message.mensaje);

      setMessages((prev) => [
        ...prev,
        {
          sender: message.usuario,
          text: message.mensaje,
          messageId: message.mensaje_id,
          replyToId: message.mensaje_responde_id || null,
          replyTo: message.mensaje_original || null,
        },
      ]);
    }

    if (message.tipo === "historial_chat") {
      console.log("📚 Historial de mensajes recibido:");
      console.table(message.mensajes);

      const antiguos = message.mensajes || [];
      setMessages((prev) => [
        ...antiguos.map((m) => ({
          sender: m.usuario,
          text: m.mensaje, // aquí es `mensaje` según como lo guardaste
          messageId: m.id || null,
          replyToId: m.mensaje_padre_id || null,
          replyTo: m.mensaje_original || null,
        })),
        ...prev,
      ]);
    }
  }, [lastJsonMessage]);
useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      if (replyToIndex !== null) {
        const mensajeOriginal = messages[replyToIndex];

        sendJsonMessage({
          tipo: "responder_mensaje",
          usuario: nickname,
          respuesta: newMessage,
          mensaje_id: mensajeOriginal.messageId,
          mensaje_original: {
            sender: mensajeOriginal.sender,
            text: mensajeOriginal.text,
          },
        });
      } else {
        sendJsonMessage({
          tipo: "chat",
          usuario: nickname,
          mensaje: newMessage,
        });
      }

      setNewMessage("");
      setReplyToIndex(null);
    }
  };

  return (
  <div className="w-full h-[500px] flex flex-col bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200 p-6">
    <h2 className="text-2xl font-extrabold text-center text-blue-700 mb-4 tracking-wide drop-shadow-sm">
      {teamName}
    </h2>

    <div className="flex-1 overflow-y-auto px-3 py-2 bg-gradient-to-b from-gray-100 via-white to-gray-100 rounded-xl border border-gray-200 shadow-inner max-h-[380px] mb-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className="mb-3 p-3 rounded-lg bg-white shadow hover:shadow-md transition relative group border border-gray-200"
        >
          {msg.replyTo && (
            <div className="text-xs text-gray-600 italic mb-2 border-l-4 border-blue-400 bg-blue-50 rounded px-2 py-1">
              En respuesta a <strong>{msg.replyTo.sender}</strong>: {msg.replyTo.text}
            </div>
          )}
          <p className="text-sm">
            <span className="font-bold text-blue-600">{msg.sender}:</span>{" "}
            {msg.text}
          </p>

          <button
            onClick={() => setReplyToIndex(index)}
            className="absolute right-2 top-2 text-blue-500 hover:text-blue-700 text-xs opacity-0 group-hover:opacity-100 transition"
            title="Responder"
          >
            ↩
          </button>
        </div>
      ))}
        <div ref={messagesEndRef} />
    </div>

    {replyToIndex !== null && (
      <div className="mb-3 p-2 bg-blue-100 border-l-4 border-blue-400 rounded-lg text-sm text-gray-700 flex justify-between items-center">
        <span>
          Respondiendo a <strong>{messages[replyToIndex]?.sender}</strong>:{" "}
          {messages[replyToIndex]?.text}
        </span>
        <button
          onClick={() => setReplyToIndex(null)}
          className="text-red-500 hover:text-red-600 text-sm ml-2"
        >
          ✖ Cancelar
        </button>
      </div>
    )}

    <div className="flex flex-col sm:flex-row items-stretch gap-2">
  <input
    type="text"
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
    placeholder="Escribe un mensaje..."
    className="w-full sm:flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm"
  />
  <button
    onClick={handleSendMessage}
    className="px-5 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-sm shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all"
  >
    Enviar
  </button>
</div>

  </div>
);

};

export default ChatRoom;
