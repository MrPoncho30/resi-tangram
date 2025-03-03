import React from "react";

const Figuras = () => {
  return (
    <svg width="300" height="300" viewBox="0 0 300 300">
      {/* Triángulo grande 1 */}
      <polygon points="0,0 150,150 0,150" fill="#e63946" />
      
      {/* Triángulo grande 2 */}
      <polygon points="150,150 300,0 300,150" fill="#f4a261" />

      {/* Triángulo mediano */}
      <polygon points="150,150 75,225 225,225" fill="#2a9d8f" />

      {/* Triángulo pequeño 1 */}
      <polygon points="150,150 75,225 0,150" fill="#457b9d" />

      {/* Triángulo pequeño 2 */}
      <polygon points="300,150 225,225 300,225" fill="#8ecae6" />

      {/* Cuadrado */}
      <rect x="225" y="225" width="75" height="75" fill="#e76f51" />

      {/* Paralelogramo */}
      <polygon points="75,225 150,300 225,225 150,150" fill="#a8dadc" />
    </svg>
  );
};

export default Figuras;
