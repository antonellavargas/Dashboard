import { useEffect, useState } from "react";
import api from "../services/api";

import ModuloInventario from "../components/ModuloInventario";

function EquiposReportados() {

  const [data, setData] = useState([]);

  useEffect(() => {
    cargarData();
  }, []);

  const cargarData = async () => {

    const response =
      await api.get("/reportados");

    setData(response.data);

  };

  return (

    <ModuloInventario
      titulo="Equipos Reportados"
      data={data}
      columnaPrincipal="ESTADO"
      columnaSecundaria="TIPO EQUIPO"
    />

  );
}

export default EquiposReportados;