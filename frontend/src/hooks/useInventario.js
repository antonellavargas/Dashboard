import { useEffect, useState } from "react";
import axios from "axios";

export default function useInventario(endpoint) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const obtenerDatos = async () => {
    try {
      setLoading(true);

      const res = await axios.get(endpoint);

      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  return {
    data,
    loading,
    refrescar: obtenerDatos
  };
}