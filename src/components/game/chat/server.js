const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  // Recibir mensaje del cliente
  ws.on('message', (message) => {
    console.log('Mensaje recibido:', message);
  });

  // Enviar mensaje al cliente
  ws.send('¡Hola desde el servidor!');
});

console.log('Servidor WebSocket corriendo en ws://localhost:8080'); 
/// SERVER DE PRUEBA LOCAL DE WEBSOCKET
