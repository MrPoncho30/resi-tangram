import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './navbar';
import { FaArrowLeft } from 'react-icons/fa';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const EvidenciaScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [imagenesOriginales, setImagenesOriginales] = useState([]);
  const [imagenesEvidencia, setImagenesEvidencia] = useState([]);
  const [equipo, setEquipo] = useState(null);

  useEffect(() => {
    const fetchEvidencia = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`http://127.0.0.1:8000/evidencias/api/informacion_completa_evidencia/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        console.log(data); // <-- Asegúrate de que esto esté aquí

        setImagenesOriginales(data.imagenes_originales || []);
        setImagenesEvidencia(data.imagenes_evidencia || []);
        setEquipo(data.equipo || null);
      } catch (err) {
        console.error('Error al obtener los datos de la evidencia:', err);
      }
    };

    fetchEvidencia();
  }, [id]);

  const radarData = {
    labels: ['Movimientos', 'Mensajes', 'Respuestas'],
    datasets: equipo?.estudiantes?.map((est, i) => ({
      label: est.nickname || est.nombre,
      data: [
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100)
      ],
      fill: true,
    })) || [],
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Navbar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Detalle de Evidencia</h1>
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-700 hover:text-gray-900">
            <FaArrowLeft className="mr-2" /> Volver
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Imagenes originales */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2 ">Tangrams Originales</h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {imagenesOriginales.map((url, idx) => (
                <img key={idx} src={url} alt={`Original ${idx}`} className="w-full rounded" />
              ))}
            </div>
          </div>

          {/* Capturas de evidencia */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Capturas del Equipo</h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {imagenesEvidencia.map((img, idx) => {
  console.log('imagen evidencia:', img); // <-- AGREGAR ESTO

  return (
    <img
      key={idx}
      src={img.imagen_url}
      alt={`Evidencia ${idx}`}
      className="w-full mb-2 rounded border"
    />
  );
})}

            </div>
          </div>

          {/* Gráfico + equipo */}
          <div className="bg-white p-4 rounded shadow flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">Rendimiento del Equipo</h2>
            <div className="w-full h-72">
              <Radar data={radarData} />
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-bold mb-2 text-center">Integrantes</h3>
              <ul className="text-center">
                {equipo?.estudiantes?.map((est) => (
                  <li key={est.id}>{est.nickname || est.nombre}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenciaScreen;
