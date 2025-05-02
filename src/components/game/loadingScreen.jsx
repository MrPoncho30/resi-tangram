// src/components/game/CargandoActividad.jsx
import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import colibriCargando from "../../assets/lottie/colibri-loading.json"; 

const CargandoActividad = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <Player
        autoplay
        loop
        src={colibriCargando}
        style={{ height: "250px", width: "250px" }}
      />
      <p className="text-xl text-blue-600 font-bold mt-4">Cargando actividad...</p>
    </div>
  );
};

export default CargandoActividad;
