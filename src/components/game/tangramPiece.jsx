import React from "react";

// Imágenes
import SquareSVG from "../../assets/cuadrado_rojo.png";
import ParallelogramSVG from "../../assets/trapecio_azul.png";
import TriangleYellowSVG from "../../assets/triangulo_amarillo.png";
import TriangleBlueSVG from "../../assets/triangulo_azul.png";
import TrianglePurpleSVG from "../../assets/triangulo_morado.png";
import TrianglePinkSVG from "../../assets/triangulo_rosa.png";
import TriangleGreenSVG from "../../assets/triangulo_verde.png";

const TangramPiece = ({ id }) => {
  const getImage = () => {
    switch (id) {
      case 0: return TriangleYellowSVG;
      case 1: return TriangleBlueSVG;
      case 2: return TrianglePurpleSVG;
      case 3: return TrianglePinkSVG;
      case 4: return TriangleGreenSVG;
      case 5: return SquareSVG;
      case 6: return ParallelogramSVG;
      default: return null;
    }
  };

  return (
    <div className="absolute z-10" style={{ width: "80px", height: "80px" }}>
      <img src={getImage()} alt={`Tangram piece ${id}`} className="w-full h-full" />
    </div>
  );
};

export default TangramPiece;
