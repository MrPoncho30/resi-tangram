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
  const [estadisticas, setEstadisticas] = useState([]);

  const colores = [
    'rgba(255, 99, 132, 0.5)',   // Rojo
    'rgba(54, 162, 235, 0.5)',   // Azul
    'rgba(255, 206, 86, 0.5)',   // Amarillo
    'rgba(75, 192, 192, 0.5)',   // Verde agua
    'rgba(153, 102, 255, 0.5)',  // Morado
    'rgba(255, 159, 64, 0.5)',   // Naranja
  ];

const totalStats = estadisticas.reduce(
  (acum, est) => {
    acum.movimientos += est.piezas_movidas || 0;
    acum.mensajes += est.mensajes_enviados || 0;
    acum.respuestas += est.respuestas_enviadas || 0;
    return acum;
  },
  { movimientos: 0, mensajes: 0, respuestas: 0 }
);

  useEffect(() => {
    const fetchEvidencia = async () => {
      try {
        const token = localStorage.getItem('accessToken'); // 🔐 Asegura que tienes el token guardado
        if (!token) {
          console.warn("⚠️ No se encontró token en localStorage.");
          return;
        }
  
        const res = await fetch(`http://127.0.0.1:8000/evidencias/api/informacion_completa_evidencia/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        const data = await res.json();
        console.log("📊 Datos completos:", data);
  
        setImagenesOriginales(data.imagenes_originales || []);
        setImagenesEvidencia(data.imagenes_evidencia || []);
        setEquipo(data.equipo || null);
        setEstadisticas(data.estadisticas || []);
      } catch (err) {
        console.error('❌ Error al obtener los datos de la evidencia:', err);
      }
    };
  
    fetchEvidencia();
  }, [id]);
  

const radarData = {
  labels: ['Movimientos', 'Mensajes', 'Respuestas'],
  datasets: [
    ...estadisticas.map((est, index) => ({
      label: est.nombre_estudiante,
      data: [
        est.piezas_movidas || 0,
        est.mensajes_enviados || 0,
        est.respuestas_enviadas || 0,
      ],
      fill: true,
      backgroundColor: colores[index % colores.length],
      borderColor: colores[index % colores.length].replace('0.5', '1'),
      pointBackgroundColor: colores[index % colores.length].replace('0.5', '1'),
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: colores[index % colores.length].replace('0.5', '1'),
    })),
    {
      label: 'General del equipo',
      data: [
        totalStats.movimientos,
        totalStats.mensajes,
        totalStats.respuestas,
      ],
      fill: true,
      backgroundColor: 'rgba(0, 128, 0, 0.2)',
      borderColor: 'rgba(0, 128, 0, 1)',
      pointBackgroundColor: 'rgba(0, 128, 0, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(0, 128, 0, 1)',
    },
  ],
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
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Tangrams Originales</h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {imagenesOriginales.map((url, idx) => (
                <img key={idx} src={url} alt={`Original ${idx}`} className="w-full rounded" />
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Capturas del Equipo</h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {imagenesEvidencia.map((img, idx) => (
                <img key={idx} src={img.imagen_url} alt={`Evidencia ${idx}`} className="w-full mb-2 rounded border" />
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">Rendimiento del Equipo</h2>
            <div className="flex justify-center items-center w-full h-[400px]">
              {estadisticas.length > 0 ? (
                <Radar data={radarData} />
              ) : (
                <p className="text-sm text-gray-500 text-center">No hay datos disponibles.</p>
              )}
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-bold mb-2 text-center">Integrantes</h3>
              <ul className="text-center text-sm">
                {equipo?.estudiantes?.map((est) => (
                  <li key={est.id}>{est.nombre}</li>
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
