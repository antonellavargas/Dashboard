import { useEffect, useState } from "react";
import api from "../services/api";

import ModuloInventario from "../components/ModuloInventario";

function Laptops() {

  const [data, setData] = useState([]);

  useEffect(() => {
    cargarData();
  }, []);

  const cargarData = async () => {

    const response =
      await api.get("/laptops");

    setData(response.data);

  };

  return (

    <ModuloInventario
      titulo="Laptops"
      data={data}
      columnaPrincipal="MARCA"
      columnaSecundaria="ÁREA"
    />

  );
}

export default Laptops;