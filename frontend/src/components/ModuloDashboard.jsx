function ModuloDashboard({
  titulo,
  descripcion,
  kpis = [],
  grafico: Grafico,
  tabla: Tabla,
  dataGrafico = [],
  dataTabla = []
}) {

  return (

    <div>

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold text-slate-800">
          {titulo}
        </h1>

        <p className="text-slate-500 mt-2">
          {descripcion}
        </p>

      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">

        {kpis.map((kpi, index) => (

          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          >

            <h2 className="text-slate-500 text-sm">
              {kpi.label}
            </h2>

            <p className="text-3xl font-bold text-slate-800 mt-2">
              {kpi.value}
            </p>

          </div>

        ))}

      </div>

      {/* GRÁFICO */}
      <div className="mb-10">
        {Grafico && <Grafico data={dataGrafico} />}
      </div>

      {/* TABLA */}
      <div>
        {Tabla && <Tabla data={dataTabla} />}
      </div>

    </div>

  );
}

export default ModuloDashboard;