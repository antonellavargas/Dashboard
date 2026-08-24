import { useState } from "react";
import api from "../services/api";

import PerfilPersona from "./PerfilPersona";

function BuscadorGlobal() {

  const [texto, setTexto] = useState("");
  const [resultados, setResultados] = useState([]);

  const [perfil, setPerfil] = useState(null);

  const buscar = async (valor) => {

    setTexto(valor);

    if (valor.trim().length < 2) {

      setResultados([]);
      return;

    }

    try {

      const response = await api.get(
        "/busqueda-personas",
        {
          params: {
            q: valor
          }
        }
      );

      setResultados(response.data);

    } catch (error) {

      console.error(error);

    }

  };

  const abrirPerfil = async (usuario) => {

    try {

      const response = await api.get(
        `/persona-completa/${encodeURIComponent(usuario)}`
      );

      setPerfil(response.data);
      
      setResultados([]);
      setTexto("");

    } catch (error) {

      console.error(error);

    }

  };

  return (

    <>

      <div className="relative w-full">

        <input
          type="text"
          placeholder="🔍 Buscar colaborador..."
          value={texto}
          onChange={(e) =>
            buscar(e.target.value)
          }
          className="
            w-full
            px-4
            py-3
            rounded-2xl
            border
            bg-white
            shadow
          "
        />

        {resultados.length > 0 && (

          <div
            className="
              absolute
              top-full
              left-0
              right-0
              mt-2
              bg-white
              rounded-2xl
              shadow-xl
              overflow-hidden
              z-50
            "
          >

            {resultados.map((persona, index) => (

              <div
                key={index}
                onClick={() =>
                  abrirPerfil(
                    persona.usuario
                  )
                }
                className="
                  p-4
                  border-b
                  hover:bg-slate-50
                  cursor-pointer
                  transition
                "
              >

                <div className="font-bold text-slate-800">

                  👤 {persona.nombre}

                </div>

                <div className="text-sm text-gray-500 mt-1">

                  {persona.cargo}

                </div>

                <div className="text-xs text-blue-600 mt-1">

                  {persona.area}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {perfil && (

        <PerfilPersona
          datos={perfil}
          onClose={() =>
            setPerfil(null)
          }
        />

      )}

    </>

  );

}

export default BuscadorGlobal;