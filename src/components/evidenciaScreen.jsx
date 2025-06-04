import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './navbar';
import { FaArrowLeft } from 'react-icons/fa';
import { Radar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
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
  const [totales, setTotales] = useState({
    piezas_movidas: 0,
    mensajes_enviados: 0,
    respuestas_enviadas: 0,
  });
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);

  const colores = [
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(255, 159, 64, 0.5)',
  ];

  useEffect(() => {
    const fetchEvidencia = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`http://127.0.0.1:8000/evidencias/api/informacion_completa_evidencia/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setImagenesOriginales(data.imagenes_originales || []);
        setImagenesEvidencia(data.imagenes_evidencia || []);
        setEquipo(data.equipo || null);
        setEstadisticas(data.estadisticas || []);
        setTotales(data.totales || {});
      } catch (err) {
        console.error('❌ Error al obtener los datos:', err);
      }
    };
    fetchEvidencia();
  }, [id]);

  const cargarImagen = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width + 2;
        canvas.height = img.height + 2;

        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1);
        ctx.drawImage(img, 1, 1);

        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => {
        console.warn('❌ No se pudo cargar la imagen:', url);
        resolve('');
      };
      img.src = url;
    });
  };

  const generarGraficaRadarCanvas = (estadisticas, totales) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;

      new ChartJS(canvas, {
        type: 'radar',
        data: {
          labels: ['Movimientos', 'Mensajes', 'Respuestas'],
          datasets: [
            ...estadisticas.map((est, i) => ({
              label: est.nombre_estudiante,
              data: [est.piezas_movidas, est.mensajes_enviados, est.respuestas_enviadas],
              fill: true,
              backgroundColor: `rgba(${i * 50}, 99, 132, 0.2)`,
              borderColor: `rgba(${i * 50}, 99, 132, 1)`,
            })),
            {
              label: 'General del equipo',
              data: [totales.piezas_movidas, totales.mensajes_enviados, totales.respuestas_enviadas],
              fill: true,
              backgroundColor: 'rgba(0, 128, 0, 0.2)',
              borderColor: 'rgba(0, 128, 0, 1)',
            },
          ],
        },
        options: {
          responsive: false,
          plugins: { legend: { position: 'top' } },
        },
      });

      setTimeout(() => resolve(canvas.toDataURL('image/png')), 800);
    });
  };

const handleGenerarPDF = async () => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const token = localStorage.getItem('accessToken');
  let y = 10;

  try {
    const res = await fetch(`http://127.0.0.1:8000/evidencias/api/informacion_completa_evidencia/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    // 🖼️ Sección 1: Tangrams Originales
    pdf.setFontSize(16);
    pdf.text('Tangrams Originales', 10, y);
    y += 10;

    let x = 10;
    for (const url of data.imagenes_originales) {
      const img = await cargarImagen(url);
      pdf.addImage(img, 'PNG', x, y, 40, 40);
      x += 45;
    }

    // 🖼️ Sección 2: Capturas del equipo (mismo tamaño, nueva fila debajo)
    y += 50;
    x = 10;
    pdf.setFontSize(16);
    pdf.text('Capturas del Equipo', 10, y);
    y += 10;

    for (const img of data.imagenes_evidencia) {
      const imgData = await cargarImagen(img.imagen_url);
      pdf.addImage(imgData, 'PNG', x, y, 40, 40);
      x += 45;
      if (x > 160) {
        x = 10;
        y += 45;
      }
    }

    // 📊 Sección 3: Gráfica + estadísticas
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.text('Gráfica de Rendimiento', 10, 15);
    const chartImage = await generarGraficaRadarCanvas(data.estadisticas, data.totales);
    pdf.addImage(chartImage, 'PNG', 10, 25, 190, 140);

    // 📄 Texto adicional debajo de gráfica
    let offset = 175;
    pdf.setFontSize(12);
    pdf.text(`Total fichas movidas por el equipo: ${data.totales.piezas_movidas}`, 10, offset);
    offset += 6;
    pdf.text(`Total mensajes enviados: ${data.totales.mensajes_enviados}`, 10, offset);
    offset += 6;
    pdf.text(`Total respuestas enviadas: ${data.totales.respuestas_enviadas}`, 10, offset);
    offset += 10;

    for (const est of data.estadisticas) {
      pdf.text(`${est.nombre_estudiante} - Movidas: ${est.piezas_movidas}, Mensajes: ${est.mensajes_enviados}, Respuestas: ${est.respuestas_enviadas}`, 10, offset);
      offset += 6;
      if (offset > 270) {
        pdf.addPage();
        offset = 20;
      }
    }

    pdf.save(`evidencia_${id}.pdf`);
  } catch (err) {
    console.error('❌ Error al generar el PDF:', err);
    alert('No se pudo generar el PDF');
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Navbar />
      <div className="flex-1 p-6 ml-60">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Detalle de Evidencia</h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-700 hover:text-gray-900 text-sm"
          >
            <FaArrowLeft className="mr-2" /> Volver
          </button>
        </div>

        <button
          onClick={handleGenerarPDF}
          className="mb-6 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg transition-all duration-300"
        >
          Descargar PDF
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tangrams originales */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
              Tangrams Originales
            </h2>
            <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
              {imagenesOriginales.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Original ${idx}`}
                  onClick={() => setImagenSeleccionada(idx)}
                  className={`w-full h-auto object-contain cursor-pointer rounded-xl border-2 transition-all duration-300 ${imagenSeleccionada === idx ? 'border-blue-500' : 'border-gray-200'}`}
                />
              ))}
            </div>
          </div>

          {/* Capturas del equipo */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
              Capturas del Equipo
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {imagenesEvidencia
                .filter((img) => img.indice === imagenSeleccionada)
                .map((img, idx) => (
                  <img
                    key={idx}
                    src={img.imagen_url}
                    alt={`Evidencia ${idx}`}
                    className="w-full rounded-xl border border-gray-200"
                  />
                ))}
            </div>
          </div>

          {/* Rendimiento */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col items-center">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
              Rendimiento del Equipo
            </h2>
            <div className="w-full h-[300px] ml-40">
              {estadisticas.length > 0 ? (
                <Radar
                  data={{
                    labels: ['Movimientos', 'Mensajes', 'Respuestas'],
                    datasets: [
                      ...estadisticas.map((est, i) => ({
                        label: est.nombre_estudiante,
                        data: [est.piezas_movidas, est.mensajes_enviados, est.respuestas_enviadas],
                        backgroundColor: colores[i % colores.length],
                        borderColor: colores[i % colores.length].replace('0.5', '1'),
                      })),
                      {
                        label: 'General del equipo',
                        data: [
                          totales.piezas_movidas,
                          totales.mensajes_enviados,
                          totales.respuestas_enviadas,
                        ],
                        backgroundColor: 'rgba(0,128,0,0.2)',
                        borderColor: 'rgba(0,128,0,1)',
                      },
                    ],
                  }}
                />
              ) : (
                <p className="text-sm text-gray-500 text-center">
                  No hay datos disponibles.
                </p>
              )}
            </div>
            <div className="mt-6 w-full">
              <h3 className="text-sm font-bold text-center text-gray-700 mb-2">
                Integrantes
              </h3>
              <div className="flex justify-center flex-wrap gap-2">
                {equipo?.estudiantes?.map((est) => (
                  <span
                    key={est.id}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {est.nombre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenciaScreen;