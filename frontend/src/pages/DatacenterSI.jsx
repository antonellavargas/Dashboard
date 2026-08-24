import { useEffect, useState } from "react";
import api from "../services/api";

import ModuloInventario from "../components/ModuloInventario";

function DatacenterSI() {

  const [data, setData] = useState([]);

  useEffect(() => {
    cargarData();
  }, []);

  const cargarData = async () => {

    const response =
      await api.get("/datacenter-si");

    setData(response.data);

  };

  return (

    <ModuloInventario
      titulo="Datacenter SI"
      data={data}
      columnaPrincipal="TIPO EQUIPO"
      columnaSecundaria="OFICINA"
    />

  );
}

export default DatacenterSI;