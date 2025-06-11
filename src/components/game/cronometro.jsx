import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

const Cronometro = forwardRef(({ socket, onTiempoTerminado, mensajeTiempo }, ref) => {
  const [segundosRestantes, setSegundosRestantes] = useState(null);
  const [tiempoTotal, setTiempoTotal] = useState(null);
  const intervaloRef = useRef(null);

  // Exponer método para obtener el tiempo usado
  useImperativeHandle(ref, () => ({
    obtenerTiempoUsado: () => {
      console.log("⏱️ Obteniendo tiempo usado: total =", tiempoTotal, ", restantes =", segundosRestantes);
      if (tiempoTotal == null || segundosRestantes == null) return 0;
      const usado = tiempoTotal - segundosRestantes;
      return Math.min(Math.max(0, usado), tiempoTotal);

    },
  }));

// Inicializar tiempo a partir de mensajeTiempo
useEffect(() => {
  console.log("🎯 useEffect de mensajeTiempo activado", mensajeTiempo);

  if (
    mensajeTiempo &&
    mensajeTiempo.tiempo_total != null &&
    mensajeTiempo.tiempo_transcurrido != null
  ) {
    const total = mensajeTiempo.tiempo_total;
    let transcurrido = mensajeTiempo.tiempo_transcurrido;

    if (transcurrido > total) {
      console.warn("⛔ Tiempo transcurrido inicial excede el total. Corrigiendo.");
      transcurrido = total;
    }

    const restantes = total - transcurrido;

    console.log("🧠 Calculando tiempo inicial:", total, "-", transcurrido, "=", restantes);

    setTiempoTotal(total);
    setSegundosRestantes(restantes > 0 ? restantes : 0);
  } else {
    console.warn("⚠️ mensajeTiempo incompleto o inválido");
  }
}, [mensajeTiempo]);


  // Escuchar mensajes del servidor con actualizaciones de tiempo
  useEffect(() => {
    if (!socket) return;

const handleMessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.tipo === "tiempo_actividad") {
    console.log("📩 tiempo_actividad recibido:", data);
    const total = data.tiempo_total;
    let transcurrido = data.tiempo_transcurrido;

    if (transcurrido > total) {
      console.warn("⛔ Tiempo transcurrido del servidor excede el total. Corrigiendo.");
      transcurrido = total;
    }

    const restantes = total - transcurrido;

    setTiempoTotal(total);
    setSegundosRestantes(restantes > 0 ? restantes : 0);
  }
};


    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket]);

  // Iniciar cronómetro descendente
  useEffect(() => {
    if (segundosRestantes === null || intervaloRef.current !== null) return;

    intervaloRef.current = setInterval(() => {
      setSegundosRestantes((prev) => {
        const nuevo = prev - 1;

        if (nuevo <= 0) {
          clearInterval(intervaloRef.current);
          intervaloRef.current = null;
          if (onTiempoTerminado) onTiempoTerminado();
          return 0;
        }

        return nuevo;
      });
    }, 1000);

    return () => {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    };
  }, [segundosRestantes, onTiempoTerminado]);

  // Solicitar sincronización de tiempo al backend
  useEffect(() => {
    if (!socket) return;

    const syncInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ tipo: "solicitar_tiempo" }));
      }
    }, 2000);

    return () => clearInterval(syncInterval);
  }, [socket]);

  // Mostrar estado inicial
  if (segundosRestantes === null) {
    return (
      <div className="flex flex-col items-center text-center p-2 bg-white rounded-lg">
        <h3 className="text-md font-bold text-blue-700">Tiempo restante</h3>
        <p className="text-2xl font-bold text-gray-400">Cargando...</p>
      </div>
    );
  }

  // Formatear como HH:MM:SS
  const horas = Math.floor(segundosRestantes / 3600);
  const minutos = Math.floor((segundosRestantes % 3600) / 60);
  const segundos = segundosRestantes % 60;

  return (
    <div className="flex flex-col items-center text-center p-2 bg-white rounded-lg">
      <h3 className="text-md font-bold text-blue-700">Tiempo restante</h3>
      <p className="text-2xl font-bold text-red-500">
        {String(horas).padStart(2, "0")}:
        {String(minutos).padStart(2, "0")}:
        {String(segundos).padStart(2, "0")}
      </p>
    </div>
  );
});

export default Cronometro;
