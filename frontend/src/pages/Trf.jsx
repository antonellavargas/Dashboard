import { useEffect, useState } from "react";
import api from "../services/api";

import ModuloInventario from "../components/ModuloInventario";

function Trf() {

  const [data, setData] = useState([]);

  useEffect(() => {
    cargarData();
  }, []);

  const cargarData = async () => {

    const response =
      await api.get("/trf");

    setData(response.data);

  };

  return (

    <ModuloInventario
      titulo="TRF"
      data={data}
      columnaPrincipal="MODELO"
      columnaSecundaria="ESTADO"
    />

  );
}

export default Trf;