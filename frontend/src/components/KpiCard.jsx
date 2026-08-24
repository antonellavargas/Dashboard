import { useNavigate } from "react-router-dom";

function KpiCard({
  titulo,
  valor,
  color,
  ruta
}) {

  const navigate = useNavigate();

  return (

    <div
      onClick={() => ruta && navigate(ruta)}
      className={`
        ${color}
        text-white
        rounded-2xl
        p-6
        shadow-lg
        cursor-pointer
        hover:scale-105
        transition
      `}
    >
      <h3 className="text-sm opacity-90">
        {titulo}
      </h3>

      <p className="text-4xl font-bold">
        {valor}
      </p>

      {ruta && (
        <p className="mt-2 text-xs opacity-75">
          Ver detalle →
        </p>
      )}
    </div>
    
  );

  

}



export default KpiCard;