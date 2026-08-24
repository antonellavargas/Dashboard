import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function GraficoPie({ data }) {

  const chartData = {

    labels: data.map(item => item.nombre),

    datasets: [
      {
        data: data.map(item => item.cantidad),

        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#F97316",
          "#8B5CF6"
        ],

        borderWidth: 0
      }
    ]
  };

  return (

    <div className="bg-white p-6 rounded-2xl shadow-lg">

      <h2 className="text-2xl font-bold mb-6">
        Distribución Equipos
      </h2>

      <div className="h-[400px] flex items-center justify-center">

        <Pie data={chartData} />

      </div>

    </div>
  );
}

export default GraficoPie;