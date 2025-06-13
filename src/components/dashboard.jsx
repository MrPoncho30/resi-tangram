import React, { useEffect } from 'react';
import { BookOpen, Users, FileText } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';

const Card = ({ icon: Icon, title, desc, onClick }) => (
  <div className="bg-white bg-opacity-20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
    <div className="flex flex-col items-center text-center">
      <Icon size={40} className="text-gray-800 mb-4" />
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-sm text-gray-600 mb-4">{desc}</p>
      <button
        onClick={onClick}
        className="bg-gray-800 hover:bg-gray-900 text-white text-sm px-5 py-2 rounded-lg transition"
      >
        Ver más
      </button>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSalones = () => navigate('../salones');
  const handleActivities = () => navigate('../activitiesPanel');
  const handleEvidencias = () => navigate('../evidencias');

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-gray-100 to-gray-200">
      <Navbar />
      <div className="flex-1 p-6 ml-60">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Panel de Administrador - Profesor
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <Card
            icon={Users}
            title="Salones"
            desc="Administra y visualiza los salones disponibles."
            onClick={handleSalones}
          />
          <Card
            icon={BookOpen}
            title="Actividades"
            desc="Consulta y gestiona las actividades."
            onClick={handleActivities}
          />
          <Card
            icon={FileText}
            title="Evidencias"
            desc="Consulta y gestiona las evidencias."
            onClick={handleEvidencias}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
