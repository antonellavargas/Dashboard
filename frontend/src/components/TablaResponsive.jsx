import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function TablaResponsive({ data = [] }) {

  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(20);

  const [sortColumn, setSortColumn] =
    useState(null);

  const [sortDirection, setSortDirection] =
    useState("asc");

  const [columnasOcultas, setColumnasOcultas] =
    useState([]);

  const columnasOriginales =
    data.length > 0
      ? Object.keys(data[0])
      : [];

  const columnas =
    columnasOriginales.filter(
      (col) =>
        !columnasOcultas.includes(col)
    );

  const dataOrdenada = useMemo(() => {

    let resultado = [...data];

    if (!sortColumn)
      return resultado;

    resultado.sort((a, b) => {

      const valorA =
        String(
          a[sortColumn] ?? ""
        ).toLowerCase();

      const valorB =
        String(
          b[sortColumn] ?? ""
        ).toLowerCase();

      if (valorA < valorB)
        return sortDirection === "asc"
          ? -1
          : 1;

      if (valorA > valorB)
        return sortDirection === "asc"
          ? 1
          : -1;

      return 0;

    });

    return resultado;

  }, [
    data,
    sortColumn,
    sortDirection
  ]);

  const totalPaginas = Math.ceil(
    dataOrdenada.length / porPagina
  );

  useEffect(() => {

    setPagina(1);

  }, [
    data,
    porPagina,
    columnasOcultas
  ]);

  const inicio =
    (pagina - 1) * porPagina;

  const fin =
    inicio + porPagina;

  const datosPagina =
    dataOrdenada.slice(
      inicio,
      fin
    );

  const exportarExcel = () => {

    const dataExportada =
      dataOrdenada.map((fila) => {

        const nuevaFila = {};

        columnas.forEach((col) => {

          nuevaFila[col] =
            fila[col];

        });

        return nuevaFila;

      });

    const worksheet =
      XLSX.utils.json_to_sheet(
        dataExportada
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Inventario"
    );

    const excelBuffer =
      XLSX.write(
        workbook,
        {
          bookType: "xlsx",
          type: "array"
        }
      );

    const archivo =
      new Blob(
        [excelBuffer],
        {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
      );

    saveAs(
      archivo,
      "inventario.xlsx"
    );

  };

  return (

    <div
      className="
        bg-white
        rounded-3xl
        shadow-xl
        border
        border-slate-200
        overflow-hidden
      "
    >

      {/* HEADER */}
      <div
        className="
          px-6
          py-4
          bg-gradient-to-r
          from-slate-800
          to-slate-900
          text-white
          flex
          flex-col
          lg:flex-row
          lg:justify-between
          lg:items-center
          gap-4
        "
      >

        <div>

          <h3 className="font-semibold text-lg">
            Inventario
          </h3>

          <p className="text-slate-300 text-sm">
            {data.length} registros encontrados
          </p>

        </div>

        <div className="flex flex-wrap gap-3 items-center">

          <div className="flex items-center gap-2">

            <span className="text-sm">
              Mostrar:
            </span>

            <select
              value={porPagina}
              onChange={(e) =>
                setPorPagina(
                  Number(
                    e.target.value
                  )
                )
              }
              className="
                bg-white
                text-slate-800
                rounded-lg
                px-3
                py-1
              "
            >

              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>

            </select>

          </div>

          <button
            onClick={exportarExcel}
            className="
              px-4
              py-2
              bg-green-600
              text-white
              rounded-xl
              hover:bg-green-700
              transition
            "
          >
            📥 Exportar Excel
          </button>

        </div>

      </div>

      {/* COLUMNAS */}
      <div
        className="
          flex
          flex-wrap
          gap-2
          p-4
          bg-slate-50
          border-b
        "
      >

        {columnasOriginales.map((columna) => (

          <button
            key={columna}
            onClick={() => {

              if (
                columnasOcultas.includes(
                  columna
                )
              ) {

                setColumnasOcultas(
                  columnasOcultas.filter(
                    (c) =>
                      c !== columna
                  )
                );

              } else {

                setColumnasOcultas([
                  ...columnasOcultas,
                  columna
                ]);

              }

            }}
            className={`
              px-3
              py-1
              rounded-xl
              text-sm
              transition

              ${
                columnasOcultas.includes(
                  columna
                )
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }
            `}
          >
            {columna}
          </button>

        ))}

      </div>

      {/* TABLA */}
      <div
        className="
          overflow-auto
          max-h-[700px]
        "
      >

        <table
          className="
            min-w-[1200px]
            w-full
            text-sm
          "
        >

          <thead
            className="
              sticky
              top-0
              z-20
              bg-slate-700
              text-white
            "
          >

            <tr>

              {columnas.map((columna) => (

                <th
                  key={columna}
                  onClick={() => {

                    if (
                      sortColumn === columna
                    ) {

                      setSortDirection(
                        sortDirection === "asc"
                          ? "desc"
                          : "asc"
                      );

                    } else {

                      setSortColumn(
                        columna
                      );

                      setSortDirection(
                        "asc"
                      );

                    }

                  }}
                  className="
                    p-4
                    text-left
                    whitespace-nowrap
                    font-semibold
                    border-b
                    border-slate-600
                    cursor-pointer
                    select-none
                    hover:bg-slate-600
                  "
                >

                  <div className="flex items-center gap-2">

                    {columna}

                    {sortColumn === columna && (

                      <span>

                        {sortDirection === "asc"
                          ? "▲"
                          : "▼"}

                      </span>

                    )}

                  </div>

                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {datosPagina.map((fila, index) => (

              <tr
                key={index}
                className={`
                  ${
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-slate-50"
                  }

                  hover:bg-blue-50
                  transition
                `}
              >

                {columnas.map((columna) => (

                  <td
                    key={columna}
                    className="
                      p-3
                      border-b
                      border-slate-100
                      whitespace-nowrap
                    "
                  >
                    {String(
                      fila[columna] ?? ""
                    )}
                  </td>

                ))}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* FOOTER */}
      <div
        className="
          p-4
          bg-slate-50
          border-t
          flex
          flex-col
          md:flex-row
          md:justify-between
          md:items-center
          gap-4
        "
      >

        <div className="text-sm text-slate-600">

          Mostrando

          {" "}

          <strong>
            {data.length === 0
              ? 0
              : inicio + 1}
          </strong>

          {" "}a{" "}

          <strong>
            {Math.min(
              fin,
              data.length
            )}
          </strong>

          {" "}de{" "}

          <strong>
            {data.length}
          </strong>

          {" "}registros

        </div>

        <div className="flex items-center gap-2">

          <button
            disabled={pagina === 1}
            onClick={() =>
              setPagina(
                pagina - 1
              )
            }
            className="
              px-4
              py-2
              rounded-xl
              bg-slate-200
              hover:bg-slate-300
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >
            ← Anterior
          </button>

          <div
            className="
              px-4
              py-2
              rounded-xl
              bg-blue-600
              text-white
              font-semibold
            "
          >
            {pagina}
            {" / "}
            {totalPaginas || 1}
          </div>

          <button
            disabled={
              pagina === totalPaginas ||
              totalPaginas === 0
            }
            onClick={() =>
              setPagina(
                pagina + 1
              )
            }
            className="
              px-4
              py-2
              rounded-xl
              bg-slate-200
              hover:bg-slate-300
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >
            Siguiente →
          </button>

        </div>

      </div>

    </div>

  );
}

export default TablaResponsive;