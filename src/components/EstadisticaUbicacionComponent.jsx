import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { EstadisticasUbicacion } from "../infrastructure/EstadisticasUbicacion";
import { GetValidToken } from "../infrastructure/GetValidToken";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function EstadisticasUbicacionComponent() {
  const token = GetValidToken();
  const [dataUbicaciones, setDataUbicaciones] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const stats = await EstadisticasUbicacion(token);
      setDataUbicaciones(stats);
    }
    fetchData();
  }, [token]);

  if (!dataUbicaciones) return <p className="text-center text-gray-500">Cargando estadísticas...</p>;

  const chartData = {
    labels: Object.keys(dataUbicaciones),
    datasets: [
      {
        label: "Usuarios por ubicacion",
        data: Object.values(dataUbicaciones),
        backgroundColor: [
          "#3b82f6", // azul
          "#10b981", // verde
          "#f59e0b", // amarillo
          "#ef4444", // rojo
        ],
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
        <span className="material-icons text-blue-500">bar_chart</span>
        Estadísticas por Ubicacion
      </h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}