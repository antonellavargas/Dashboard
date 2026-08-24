import { useMemo, useState } from "react";

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

import TablaResponsive from "./TablaResponsive";
import SearchBar from "./SearchBar";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function ModuloInventario({
  titulo,
  data = [],
  columnaPrincipal,
  columnaSecundaria
}) {

  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({});

  const dataSegura = Array.isArray(data)
    ? data
    : [];

  const dataFiltrada = useMemo(() => {

    return dataSegura.filter((fila) => {

      const coincideBusqueda =
        Object.values(fila)
          .join(" ")
          .toLowerCase()
          .includes(
            busqueda.toLowerCase()
          );

      const coincideFiltros =
        Object.entries(filtros)
          .every(([col, valor]) => {

            if (!valor) return true;

            return String(
              fila[col] ?? ""
            )
              .toLowerCase()
              .includes(
                valor.toLowerCase()
              );

          });

      return (
        coincideBusqueda &&
        coincideFiltros
      );

    });

  }, [
    dataSegura,
    busqueda,
    filtros
  ]);

  const totalRegistros = dataSegura.length;

  const totalColumnas =
    dataSegura.length > 0
      ? Object.keys(dataSegura[0]).length
      : 0;

  const resumenPrincipal = {};

  dataSegura.forEach((item) => {

    const valor =
      item[columnaPrincipal] || "Sin dato";

    resumenPrincipal[valor] =
      (resumenPrincipal[valor] || 0) + 1;

  });

  const labelsPrincipal =
    Object.keys(resumenPrincipal);

  const valoresPrincipal =
    Object.values(resumenPrincipal);

  const resumenSecundario = {};

  dataSegura.forEach((item) => {

    const valor =
      item[columnaSecundaria] || "Sin dato";

    resumenSecundario[valor] =
      (resumenSecundario[valor] || 0) + 1;

  });

  const labelsSecundario =
    Object.keys(resumenSecundario);

  const valoresSecundario =
    Object.values(resumenSecundario);

  const columnas =
    dataSegura.length > 0
      ? Object.keys(dataSegura[0])
      : [];

  const colores = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EF4444",
    "#06B6D4",
    "#EC4899",
    "#84CC16",
    "#F97316",
    "#6366F1"
  ];

  return (

    <div
      className="
        max-w-[1800px]
        mx-auto
        space-y-6
      "
    >

      {/* HEADER */}
      <div
        className="
          bg-gradient-to-r
          from-slate-900
          via-slate-800
          to-slate-900
          text-white
          p-8
          rounded-3xl
          shadow-2xl
        "
      >

        <div
          className="
            flex
            flex-col
            xl:flex-row
            xl:justify-between
            xl:items-center
            gap-4
          "
        >

          <div>

            <h1 className="text-4xl font-bold">
              {titulo}
            </h1>

            <p className="text-slate-300 mt-2">
              Gestión y análisis de activos TI
            </p>

          </div>

          <SearchBar
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
            placeholder="🔍 Buscar..."
          />

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-4
              gap-3
              mt-4
            "
          >

            {columnas.slice(0, 8).map((columna) => (

              <input
                key={columna}
                type="text"
                placeholder={`Filtrar ${columna}`}
                value={filtros[columna] || ""}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    [columna]:
                      e.target.value
                  })
                }
                className="
                  border
                  rounded-xl
                  px-3
                  py-2
                "
              />

            ))}

          </div>

        </div>

      </div>

      {/* KPIS */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-6
          gap-4
        "
      >

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <p>Total Registros</p>
          <h2 className="text-3xl font-bold">
            {totalRegistros}
          </h2>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <p>Filtrados</p>
          <h2 className="text-3xl font-bold">
            {dataFiltrada.length}
          </h2>
        </div>

        <div className="bg-gradient-to-r from-violet-500 to-violet-600 text-white p-5 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <p>Columnas</p>
          <h2 className="text-3xl font-bold">
            {totalColumnas}
          </h2>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-5 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <p>Categorías</p>
          <h2 className="text-3xl font-bold">
            {labelsPrincipal.length}
          </h2>
        </div>

        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-5 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <p>{columnaPrincipal}</p>
          <h2 className="text-lg font-bold truncate">
            {labelsPrincipal[0] || "-"}
          </h2>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-5 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <p>{columnaSecundaria}</p>
          <h2 className="text-lg font-bold truncate">
            {labelsSecundario[0] || "-"}
          </h2>
        </div>

      </div>

      {/* GRÁFICOS */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        "
      >

        <div
          className="
            bg-white
            p-6
            rounded-3xl
            shadow-xl
            border
            border-slate-100
            hover:shadow-2xl
            transition-all
            duration-300
          "
        >

          <h2 className="text-xl font-bold mb-4">
            Distribución por {columnaPrincipal}
          </h2>

          <div className="h-[400px]">

            <Bar
              data={{
                labels: labelsPrincipal,
                datasets: [
                  {
                    label: columnaPrincipal,
                    data: valoresPrincipal,
                    backgroundColor: colores,
                    borderRadius: 12
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false
              }}
            />

          </div>

        </div>

        <div
          className="
            bg-white
            p-6
            rounded-3xl
            shadow-xl
            border
            border-slate-100
            hover:shadow-2xl
            transition-all
            duration-300
          "
        >

          <h2 className="text-xl font-bold mb-4">
            Distribución por {columnaSecundaria}
          </h2>

          <div className="h-[400px]">

            <Doughnut
              data={{
                labels: labelsSecundario,
                datasets: [
                  {
                    data: valoresSecundario,
                    backgroundColor: colores,
                    borderWidth: 0
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false
              }}
            />

          </div>

        </div>

      </div>

      {/* TOP 5 + INDICADORES */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        "
      >

        <div className="bg-white p-6 rounded-3xl shadow-xl">

          <h2 className="text-xl font-bold mb-4">
            Top 5 {columnaPrincipal}
          </h2>

          <div className="space-y-3">

            {Object.entries(resumenPrincipal)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([nombre, total]) => (

                <div
                  key={nombre}
                  className="
                    flex
                    justify-between
                    bg-slate-50
                    p-3
                    rounded-xl
                  "
                >

                  <span>{nombre}</span>

                  <span className="font-bold">
                    {total}
                  </span>

                </div>

              ))}

          </div>

        </div>

        <div className="bg-white p-6 rounded-3xl shadow-xl">

          <h2 className="text-xl font-bold mb-4">
            Indicadores
          </h2>

          <div className="space-y-3">

            <div className="bg-blue-50 p-3 rounded-xl">
              📊 {totalRegistros} registros cargados
            </div>

            <div className="bg-green-50 p-3 rounded-xl">
              🔎 {dataFiltrada.length} visibles
            </div>

            <div className="bg-violet-50 p-3 rounded-xl">
              📂 {labelsPrincipal.length} categorías
            </div>

            {totalRegistros === 0 && (

              <div className="bg-red-50 p-3 rounded-xl">
                ⚠ Sin información
              </div>

            )}

          </div>

        </div>

      </div>

      {/* TABLA */}
      <TablaResponsive
        data={dataFiltrada}
      />

    </div>
  );
}

export default ModuloInventario;