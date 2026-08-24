import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

import {
  Bar,
  Doughnut
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import KpiCard from "../components/KpiCard";
import BuscadorGlobal from "../components/BuscadorGlobal";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function DashboardGeneral() {

  const [kpis, setKpis] = useState({});

  useEffect(() => {
    obtenerKpis();
  }, []);

  const obtenerKpis = async () => {
    try {
      const response = await api.get("/kpis");

      setKpis(response.data);

    } catch (error) {
      console.error("Error obteniendo KPIs:", error);
    }
  };

  // 📊 FILTRO KPIS
  const dataBar = useMemo(() => ({

    labels: [
      "Laptops",
      "Celulares",
      "Monitores",
      "Impresoras",
      "Modem",
      "Exchange",
      "Chips"
    ],

    datasets: [
      {
        label: "Inventario TI",

        data: [
          kpis.laptops || 0,
          kpis.celulares || 0,
          kpis.monitores || 0,
          kpis.impresoras || 0,
          kpis.modem || 0,
          kpis.exchange || 0,
          kpis.chips || 0
        ],

        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#8B5CF6",
          "#F59E0B",
          "#06B6D4",
          "#EC4899",
          "#F97316"
        ],

        borderRadius: 12
      }
    ]

  }), [kpis]);

  // 🍩 DOUGHNUT
  const dataDoughnut = {

    labels: [
      "Laptops",
      "Celulares",
      "Otros"
    ],

    datasets: [
      {
        data: [

          kpis.laptops || 0,

          kpis.celulares || 0,

          (
            (kpis.total || 0)
            -
            (kpis.laptops || 0)
            -
            (kpis.celulares || 0)
          )
        ],

        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#CBD5E1"
        ],

        borderWidth: 0
      }
    ]
  };

  // 📥 EXPORTAR
  const exportarExcel = () => {

    const data = [
      {
        Tipo: "Laptops",
        Cantidad: kpis.laptops
      },
      {
        Tipo: "Celulares",
        Cantidad: kpis.celulares
      },
      {
        Tipo: "Monitores",
        Cantidad: kpis.monitores
      },
      {
        Tipo: "Impresoras",
        Cantidad: kpis.impresoras
      },
      {
        Tipo: "Modem",
        Cantidad: kpis.modem
      },
      {
        Tipo: "Exchange",
        Cantidad: kpis.exchange
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Dashboard TI"
    );

    const excelBuffer = XLSX.write(
      workbook,
      {
        bookType: "xlsx",
        type: "array"
      }
    );

    const fileData = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }
    );

    saveAs(
      fileData,
      "dashboard_ti.xlsx"
    );
  };

  // 🚨 ALERTAS
  const alertas = [];

  if ((kpis.modem || 0) < 10) {
    alertas.push("⚠ Stock bajo de Modems");
  }

  if ((kpis.chips || 0) < 15) {
    alertas.push("⚠ Chips próximos a agotarse");
  }

  return (

    <div
      className="
        max-w-[1800px]
        mx-auto
        space-y-8
      "
    >

      {/* HEADER */}
      <div
        className="
          flex
          flex-col
          sm:flex-row
          gap-3
          w-full
          xl:w-auto
        "
      >

        <div className="w-full sm:w-[400px]">
          <BuscadorGlobal />
        </div>

        <button
          onClick={exportarExcel}
          className="
            bg-slate-800
            text-white
            px-5
            py-3
            rounded-2xl
            shadow
            hover:bg-slate-700
          "
        >
          Exportar Excel
        </button>

      </div>


      {/* ALERTAS */}
      {alertas.length > 0 && (

        <div className="bg-amber-100 border border-amber-300 p-5 rounded-2xl">

          <h2 className="font-bold text-amber-800 mb-3">
            Alertas TI
          </h2>

          <div className="space-y-2">

            {alertas.map((alerta, index) => (

              <div key={index}>
                {alerta}
              </div>

            ))}

          </div>

        </div>

      )}

      {/* KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-6">

        <KpiCard
          titulo="Total Equipos"
          valor={kpis.total || 0}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />

        <KpiCard
          titulo="Laptops"
          valor={kpis.laptops || 0}
          ruta="/laptops"
          color="bg-gradient-to-r from-emerald-500 to-emerald-600"
        />

        <KpiCard
          titulo="Celulares"
          valor={kpis.celulares || 0}
          ruta="/celulares"
          color="bg-gradient-to-r from-violet-500 to-violet-600"
        />

        <KpiCard
          titulo="Exchange"
          valor={kpis.exchange || 0}
          ruta="/exchange"
          color="bg-gradient-to-r from-pink-500 to-pink-600"
        />

        <KpiCard
          titulo="Chips"
          valor={kpis.chips || 0}
          ruta="/chips"
          color="bg-gradient-to-r from-orange-500 to-orange-600"
        />

        <KpiCard
          titulo="Impresoras"
          valor={kpis.impresoras || 0}
          ruta="/impresoras"
          color="bg-gradient-to-r from-cyan-500 to-cyan-600"
        />

        <KpiCard
          titulo="Modem"
          valor={kpis.modem || 0}
          ruta="/modem"
          color="bg-gradient-to-r from-red-500 to-red-600"
        />

        <KpiCard
          titulo="Monitores"
          valor={kpis.monitores || 0}
          ruta="/monitores"
          color="bg-gradient-to-r from-green-500 to-green-600"
        />

      </div>


      {/* GRAFICOS */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
          items-start
        "
      >

        {/* BARRAS */}
        <div className="bg-white p-6 rounded-3xl shadow-xl">

          <h2 className="text-2xl font-bold mb-6">
            Distribución TI
          </h2>

          <div className="h-[320px]">

            <Bar
              data={dataBar}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />

          </div>

        </div>

        {/* DOUGHNUT */}
        <div className="bg-white p-6 rounded-3xl shadow-xl">

          <h2 className="text-2xl font-bold mb-6">
            Participación General
          </h2>

          <div className="h-[320px] flex items-center justify-center">

            <div className="w-[260px] h-[260px]">

              <Doughnut
                data={dataDoughnut}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom"
                    }
                  }
                }}
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DashboardGeneral;