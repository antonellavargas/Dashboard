export default function FiltrosGlobales({
  busqueda,
  setBusqueda,
  columnas,
  columnaSeleccionada,
  setColumnaSeleccionada
}) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <input
        type="text"
        placeholder="Buscar..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="border rounded px-3 py-2"
      />

      <select
        value={columnaSeleccionada}
        onChange={(e) => setColumnaSeleccionada(e.target.value)}
        className="border rounded px-3 py-2"
      >
        <option value="">Todas</option>

        {columnas.map(col => (
          <option key={col} value={col}>
            {col}
          </option>
        ))}
      </select>
    </div>
  );
}