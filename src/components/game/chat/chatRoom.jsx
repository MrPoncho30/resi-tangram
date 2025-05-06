import React, { useState, useEffect } from "react";
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
    <div className="w-full h-[500px] flex flex-col bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-2xl font-semibold text-center mb-4">
        "{teamName}"
      </h2>

      <div className="flex-1 overflow-y-auto p-2 mb-4 bg-gray-100 rounded-lg max-h-[400px]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="mb-2 p-2 bg-gray-200 rounded-md relative group"
          >
            {msg.replyTo && (
              <div className="text-sm text-gray-600 italic mb-1 pl-2 border-l-4 border-blue-400 bg-blue-100 rounded p-1">
                En respuesta a <strong>{msg.replyTo.sender}</strong>: {msg.replyTo.text}
              </div>
            )}
            <span className="font-bold">{msg.sender}:</span> {msg.text}

            <button
              onClick={() => setReplyToIndex(index)}
              className="absolute right-2 top-2 text-blue-500 hover:text-blue-700 text-sm hidden group-hover:inline"
              title="Responder"
            >
              ↩
            </button>
          </div>
        ))}
      </div>

      {replyToIndex !== null && (
        <div className="mb-2 p-2 border-l-4 border-blue-400 bg-blue-100 rounded">
          <span className="text-sm text-gray-700">
            Respondiendo a <strong>{messages[replyToIndex]?.sender}</strong>:{" "}
            {messages[replyToIndex]?.text}
          </span>
          <button
            onClick={() => setReplyToIndex(null)}
            className="ml-2 text-red-500 text-sm"
          >
            ✖ Cancelar
          </button>
        </div>
      )}

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
