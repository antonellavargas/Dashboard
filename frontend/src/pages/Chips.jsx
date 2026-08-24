import { useEffect, useState } from "react";
import api from "../services/api";

import ModuloInventario from "../components/ModuloInventario";

function Chips() {

  const [data, setData] = useState([]);

  useEffect(() => {
    cargarData();
  }, []);

  const cargarData = async () => {

    const response =
      await api.get("/chips");

    setData(response.data);

  };

  return (

    <ModuloInventario
      titulo="Chips"
      data={data}
      columnaPrincipal="ESTADO"
      columnaSecundaria="TIPO DE ASIGNACIÓN"
    />

  );
}

export default Chips;