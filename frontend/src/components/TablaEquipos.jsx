function TablaEquipos({ data }) {

  const safeData = Array.isArray(data)
    ? data
    : [];

  if (!safeData.length) {

    return (
      <div className="bg-white p-6 rounded-2xl shadow text-gray-500">
        No hay datos disponibles
      </div>
    );
  }

  // 🔥 limpieza automática
  const cleanData = safeData.map((row) => {

    const flat = {};

    Object.keys(row).forEach((key) => {

      const value = row[key];

      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {

        Object.keys(value).forEach((subKey) => {
          flat[subKey] = value[subKey];
        });

      } else {

        flat[key] = value;

      }

    });

    return flat;
  });

  const columnas = Object.keys(cleanData[0]);

  return (

    <div className="w-full overflow-hidden">

      <div className="overflow-x-auto rounded-3xl shadow-xl bg-white">

        <table className="min-w-full text-sm">

          <thead className="bg-slate-100 sticky top-0">

            <tr>

              {columnas.map((columna) => (

                <th
                  key={columna}
                  className="
                    p-4
                    text-left
                    border-b
                    font-semibold
                    text-slate-700
                    whitespace-nowrap
                  "
                >
                  {columna}
                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {cleanData.map((fila, index) => (

              <tr
                key={index}
                className="hover:bg-slate-50 transition"
              >

                {columnas.map((columna) => (

                  <td
                    key={columna}
                    className="
                      p-3
                      border-b
                      whitespace-nowrap
                    "
                  >
                    {String(fila[columna] ?? "")}
                  </td>

                ))}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default TablaEquipos;