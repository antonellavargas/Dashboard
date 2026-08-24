import { useEffect, useState } from "react";
import api from "../services/api";

import ModuloInventario from "../components/ModuloInventario";

function DataPersonal() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarData();
  }, []);

  const cargarData = async () => {
    try {
      setLoading(true);

      const response = await api.get("/data-personal");

      setData(response.data);

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (

    <ModuloInventario
      titulo="Data Personal"
      data={data}
      columnaPrincipal="ÁREA"
      columnaSecundaria="CARGO"
    />

  );
}

export default DataPersonal;