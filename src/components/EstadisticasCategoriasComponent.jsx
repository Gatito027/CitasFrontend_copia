import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { EstadisticasCategoria } from "../infrastructure/EstadisticasCategoria";
import { GetValidToken } from "../infrastructure/GetValidToken";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function EstadisticasCategoriaComponent() {
  const token = GetValidToken();
  const [dataCategorias, setDataCategorias] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const stats = await EstadisticasCategoria(token);
        setDataCategorias(stats);
      } catch (err) {
        setError("Error al cargar las estadísticas de categorías");
        console.error("Error fetching category stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando estadísticas de categorías...</p>
          <p className="text-gray-400 text-sm mt-1">Espere un momento por favor</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center shadow-lg">
        <span className="material-icons text-red-500 text-5xl mb-4">error_outline</span>
        <h3 className="text-red-800 font-semibold text-lg mb-2">Error de carga</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2 mx-auto"
        >
          <span className="material-icons text-sm">refresh</span>
          Reintentar
        </button>
      </div>
    );
  }

  if (!dataCategorias || Object.keys(dataCategorias).length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center shadow-lg">
        <span className="material-icons text-yellow-500 text-5xl mb-4">inventory_2</span>
        <h3 className="text-yellow-800 font-semibold text-lg mb-2">Sin datos disponibles</h3>
        <p className="text-yellow-600">No hay estadísticas de categorías para mostrar</p>
      </div>
    );
  }

  const categorias = Object.keys(dataCategorias);
  const valores = Object.values(dataCategorias);
  const totalUsuarios = valores.reduce((sum, count) => sum + count, 0);
  const categoriaMasPopular = categorias[valores.indexOf(Math.max(...valores))];

  const chartData = {
    labels: categorias,
    datasets: [
      {
        label: "Usuarios por categoría",
        data: valores,
        backgroundColor: [
          "#8b5cf6", // violeta
          "#06b6d4", // cian
          "#10b981", // verde
          "#f59e0b", // ámbar
          "#ef4444", // rojo
          "#3b82f6", // azul
          "#f97316", // naranja
          "#84cc16", // lime
        ].slice(0, categorias.length),
        borderRadius: 12,
        borderWidth: 0,
        hoverBackgroundColor: [
          "#7c3aed",
          "#0891b2",
          "#059669",
          "#d97706",
          "#dc2626",
          "#2563eb",
          "#ea580c",
          "#65a30d",
        ].slice(0, categorias.length),
        hoverBorderWidth: 2,
        hoverBorderColor: "#ffffff",
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: false 
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1f2937",
        bodyColor: "#374151",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 10,
        padding: 12,
        displayColors: true,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        titleFont: {
          size: 14,
          weight: "600",
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            const percentage = ((value / totalUsuarios) * 100).toFixed(1);
            return `${value} usuarios (${percentage}%)`;
          }
        }
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
            family: "'Inter', sans-serif",
          },
          padding: 8,
        },
        grid: {
          color: "#f3f4f6",
          drawBorder: false,
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
            family: "'Inter', sans-serif",
          },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
          <span className="material-icons text-purple-600 text-4xl">category</span>
          Estadísticas por Categoría
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Distribución de usuarios según sus categorías preferidas en la plataforma
        </p>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total de Usuarios</p>
              <p className="text-3xl font-bold mt-1">{totalUsuarios}</p>
            </div>
            <span className="material-icons text-4xl opacity-80">group</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm font-medium">Categorías Activas</p>
              <p className="text-3xl font-bold mt-1">{categorias.length}</p>
            </div>
            <span className="material-icons text-4xl opacity-80">label</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Categoría Más Popular</p>
              <p className="text-xl font-bold mt-1 truncate" title={categoriaMasPopular}>
                {categoriaMasPopular}
              </p>
            </div>
            <span className="material-icons text-4xl opacity-80">trending_up</span>
          </div>
        </div>
      </div>

      {/* Main Chart Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="material-icons text-purple-600 text-2xl">analytics</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Distribución por Categorías</h2>
                <p className="text-gray-500 text-sm">Número de usuarios en cada categoría</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="h-80">
            <Bar data={chartData} options={options} />
          </div>

          {/* Categories Legend */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="material-icons text-gray-600 text-xl">legend_toggle</span>
              Resumen por Categoría
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorias.map((categoria, index) => {
                const valor = valores[index];
                const porcentaje = ((valor / totalUsuarios) * 100).toFixed(1);
                return (
                  <div
                    key={categoria}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
                      ></div>
                      <span className="font-medium text-gray-700 truncate" title={categoria}>
                        {categoria}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{valor}</p>
                      <p className="text-sm text-gray-500">{porcentaje}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}