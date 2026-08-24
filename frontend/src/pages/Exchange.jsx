import { useEffect, useState } from "react";
import api from "../services/api";

import ModuloInventario from "../components/ModuloInventario";

function Exchange() {

  const [data, setData] = useState([]);

  useEffect(() => {
    cargarData();
  }, []);

  const cargarData = async () => {

    const response =
      await api.get("/exchange");

    setData(response.data);

  };

  return (

    <ModuloInventario
      titulo="Exchange"
      data={data}
      columnaPrincipal="USUARIO"
      columnaSecundaria="REGLAS"
    />

  );
}

export default Exchange;