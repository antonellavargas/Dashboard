import { useEffect, useState } from "react";
import api from "../services/api";

import ModuloInventario from "../components/ModuloInventario";

function Monitores() {

  const [data, setData] = useState([]);

  useEffect(() => {
    cargarData();
  }, []);

  const cargarData = async () => {

    const response =
      await api.get("/monitores");

    setData(response.data);

  };

  return (

    <ModuloInventario
      titulo="Monitores"
      data={data}
      columnaPrincipal="MARCA"
      columnaSecundaria="ÁREA"
    />

  );
}

export default Monitores;