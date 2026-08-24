import { useEffect, useState } from "react";
import api from "../services/api";

import ModuloInventario from "../components/ModuloInventario";

function Impresoras() {

  const [data, setData] = useState([]);

  useEffect(() => {
    cargarData();
  }, []);

  const cargarData = async () => {

    const response =
      await api.get("/impresoras");

    setData(response.data);

  };

  return (

    <ModuloInventario
      titulo="Impresoras"
      data={data}
      columnaPrincipal="MARCA"
      columnaSecundaria="ESTADO"
    />

  );
}

export default Impresoras;