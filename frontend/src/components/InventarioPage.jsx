import { useMemo, useState } from "react";

import TablaResponsive from "./TablaResponsive";
import SearchBar from "./SearchBar";

function InventarioPage({
  titulo,
  data = []
}) {

  const [busqueda, setBusqueda] = useState("");

  const dataSegura = Array.isArray(data)
    ? data
    : [];

  const dataFiltrada = useMemo(() => {

    return dataSegura.filter((fila) =>

      Object.values(fila)
        .join(" ")
        .toLowerCase()
        .includes(busqueda.toLowerCase())

    );

  }, [dataSegura, busqueda]);

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
          bg-white
          p-6
          rounded-3xl
          shadow-xl
        "
      >

        <div
          className="
            flex
            flex-col
            xl:flex-row
            xl:items-center
            xl:justify-between
            gap-4
          "
        >

          <div>

            <h1
              className="
                text-3xl
                xl:text-4xl
                font-bold
                text-slate-800
              "
            >
              {titulo}
            </h1>

            <p className="text-gray-500 mt-2">
              Gestión de inventario TI
            </p>

          </div>

          <div className="w-full xl:w-auto">

            <SearchBar
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
              placeholder="🔍 Buscar usuario, equipo, área..."
            />

          </div>

        </div>

      </div>

      {/* KPIS */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-3
          gap-4
        "
      >

        <div
          className="
            bg-white
            rounded-3xl
            shadow-lg
            p-5
          "
        >

          <p className="text-gray-500 text-sm">
            Total registros
          </p>

          <h2
            className="
              text-3xl
              font-bold
              text-slate-800
              mt-2
            "
          >
            {dataSegura.length}
          </h2>

        </div>

        <div
          className="
            bg-white
            rounded-3xl
            shadow-lg
            p-5
          "
        >

          <p className="text-gray-500 text-sm">
            Resultados filtrados
          </p>

          <h2
            className="
              text-3xl
              font-bold
              text-emerald-600
              mt-2
            "
          >
            {dataFiltrada.length}
          </h2>

        </div>

        <div
          className="
            bg-white
            rounded-3xl
            shadow-lg
            p-5
          "
        >

          <p className="text-gray-500 text-sm">
            Columnas
          </p>

          <h2
            className="
              text-3xl
              font-bold
              text-blue-600
              mt-2
            "
          >
            {
              dataSegura.length > 0
                ? Object.keys(dataSegura[0]).length
                : 0
            }
          </h2>

        </div>

      </div>

      {/* TABLA */}
      <TablaResponsive
        data={dataFiltrada}
      />

    </div>

  );
}

export default InventarioPage;