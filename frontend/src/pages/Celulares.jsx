import { useEffect, useState } from "react";
import api from "../services/api";

import ModuloInventario from "../components/ModuloInventario";

function Celulares() {

  const [data, setData] = useState([]);

  useEffect(() => {
    cargarData();
  }, []);

  const cargarData = async () => {

    const response =
      await api.get("/celulares");

    setData(response.data);

  };

  return (

    <ModuloInventario
      titulo="Celulares"
      data={data}
      columnaPrincipal="MARCA"
      columnaSecundaria="OPERADOR"
    />

  );
}

export default Celulares;