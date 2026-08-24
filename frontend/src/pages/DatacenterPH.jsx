import { useEffect, useState } from "react";
import api from "../services/api";

import ModuloInventario from "../components/ModuloInventario";

function DatacenterPH() {

  const [data, setData] = useState([]);

  useEffect(() => {
    cargarData();
  }, []);

  const cargarData = async () => {

    const response =
      await api.get("/datacenter-ph");

    setData(response.data);

  };

  return (

    <ModuloInventario
      titulo="Datacenter PH"
      data={data}
      columnaPrincipal="TIPO EQUIPO"
      columnaSecundaria="OFICINA"
    />

  );
}

export default DatacenterPH;