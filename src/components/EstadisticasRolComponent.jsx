import { EstadisticasRol } from "../infrastructure/EstadisticasRol";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { GetValidToken } from "../infrastructure/GetValidToken";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function EstadisticasRolComponent() {
  const token = GetValidToken();
  const [dataRoles, setDataRoles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const stats = await EstadisticasRol(token);
        setDataRoles(stats);
      } catch (err) {
        setError("Error al cargar las estadísticas");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <span className="material-icons text-red-500 text-4xl mb-3">error</span>
        <p className="text-red-700 font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!dataRoles || Object.keys(dataRoles).length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
        <span className="material-icons text-yellow-500 text-4xl mb-3">info</span>
        <p className="text-yellow-700 font-medium">No hay datos disponibles</p>
      </div>
    );
  }

  const chartData = {
    labels: Object.keys(dataRoles),
    datasets: [
      {
        label: "Usuarios por rol",
        data: Object.values(dataRoles),
        backgroundColor: [
          "#3b82f6", // azul
          "#10b981", // verde
          "#f59e0b", // amarillo
          "#ef4444", // rojo
          "#8b5cf6", // violeta
          "#06b6d4", // cian
          "#f97316", // naranja
        ],
        borderRadius: 8,
        borderWidth: 0,
        hoverBackgroundColor: [
          "#2563eb",
          "#059669",
          "#d97706",
          "#dc2626",
          "#7c3aed",
          "#0891b2",
          "#ea580c",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1f2937",
        bodyColor: "#374151",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: "#6b7280",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "#f3f4f6",
        },
        border: {
          display: false,
        },
      },
      x: {
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
            weight: "500",
          },
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
  };

  const totalUsuarios = Object.values(dataRoles).reduce((sum, count) => sum + count, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <span className="material-icons text-sky-600 text-4xl">group</span>
          Estadísticas de usuarios
        </h1>
        <p className="text-gray-600">Distribución de usuarios por roles en el sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total de Usuarios</p>
              <p className="text-3xl font-bold mt-1">{totalUsuarios}</p>
            </div>
            <span className="material-icons text-4xl opacity-80">people</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Promedio por Rol</p>
              <p className="text-3xl font-bold mt-1">
                {Math.round(totalUsuarios / Object.keys(dataRoles).length)}
              </p>
            </div>
            <span className="material-icons text-4xl opacity-80">equalizer</span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-icons text-sky-600 text-2xl">bar_chart</span>
              <h2 className="text-xl font-semibold text-gray-800">Distribución por Roles</h2>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="h-80">
            <Bar data={chartData} options={options} />
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            {Object.keys(dataRoles).map((rol, index) => (
              <div key={rol} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
                ></div>
                <span className="text-sm text-gray-700 font-medium">
                  {rol}: {dataRoles[rol]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}