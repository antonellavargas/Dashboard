import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function GraficoEquipos({ data }) {

  const chartData = {

    labels: data.map(item => item.nombre),

    datasets: [
      {
        label: "Cantidad Equipos",

        data: data.map(item => item.cantidad),

        backgroundColor: [
          "#3B82F6",
          "#6366F1",
          "#10B981",
          "#F97316"
        ],

        borderRadius: 12,
        borderSkipped: false
      }
    ]
  };

  const options = {

    responsive: true,

    plugins: {

      legend: {
        display: false
      }

    },

    scales: {

      y: {

        beginAtZero: true,

        grid: {
          color: "#E2E8F0"
        }

      },

      x: {

        grid: {
          display: false
        }

      }

    }

  };

  return (

    <div className="bg-white p-6 rounded-3xl shadow-xl">

      <div className="mb-6">

        <h2 className="text-3xl font-bold text-slate-800">
          Equipos por Categoría
        </h2>

        <p className="text-slate-500 mt-1">
          Distribución general del inventario
        </p>

      </div>

      <div className="h-[400px]">

        <Bar
          data={chartData}
          options={options}
        />

      </div>

    </div>
  );
}

export default GraficoEquipos;