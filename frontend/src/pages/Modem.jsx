import { useEffect, useState } from "react";
import api from "../services/api";

import ModuloInventario from "../components/ModuloInventario";

function Modem() {

  const [data, setData] = useState([]);

  useEffect(() => {
    cargarData();
  }, []);

  const cargarData = async () => {

    const response =
      await api.get("/modem");

    setData(response.data);

  };

  return (

    <ModuloInventario
      titulo="Modem"
      data={data}
      columnaPrincipal="OPERADOR"
      columnaSecundaria="ÁREA"
    />

  );
}

export default Modem;