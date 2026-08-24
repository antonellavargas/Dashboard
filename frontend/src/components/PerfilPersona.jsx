function PerfilPersona({
  datos,
  onClose
}) {

  if (!datos) return null;

  const persona = datos.persona || {};

  return (

    <div
      className="
        fixed
        inset-0
        bg-black/40
        flex
        items-center
        justify-center
        z-[999]
        p-4
      "
    >

      <div
        className="
          bg-white
          rounded-3xl
          shadow-2xl
          w-full
          max-w-7xl
          max-h-[95vh]
          overflow-auto
          p-8
        "
      >

        {/* HEADER */}

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-3xl font-bold text-slate-800">

              👤 {persona["NOMBRES Y APELLIDOS"]}

            </h1>

            <p className="text-gray-500 mt-1">

              {persona["CARGO"]}

            </p>

          </div>

          <button
            onClick={onClose}
            className="
              bg-red-500
              text-white
              px-4
              py-2
              rounded-xl
              hover:bg-red-600
            "
          >
            Cerrar
          </button>

        </div>

        {/* RESUMEN */}

        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-5
            gap-4
            mb-8
          "
        >

          <ResumenCard
            titulo="💻 Equipos"
            valor={datos.total_laptops}
          />

          <ResumenCard
            titulo="📱 Celulares"
            valor={datos.total_celulares}
          />

          <ResumenCard
            titulo="📞 Chips"
            valor={datos.total_chips}
          />

          <ResumenCard
            titulo="📧 Exchange"
            valor={datos.total_exchange}
          />

          <ResumenCard
            titulo="📡 Modem"
            valor={datos.total_modem}
          />

        </div>

        {/* DATOS PERSONALES */}

        <Seccion titulo="Datos Personales">

          <InfoGrid>

            <Campo
              label="DNI"
              value={persona["DNI - CE"]}
            />

            <Campo
              label="Área"
              value={persona["ÁREA"]}
            />

            <Campo
              label="Supervisor"
              value={persona["SUPERVISOR"]}
            />

            <Campo
              label="Estado"
              value={persona["ESTADO"]}
            />

            <Campo
              label="Correo Outlook"
              value={persona["CORREOS OUTLOOK"]}
            />

            <Campo
              label="Correo Gmail"
              value={persona["CORREOS GMAIL"]}
            />

          </InfoGrid>

        </Seccion>

        {/* LAPTOPS */}

        <Seccion titulo="💻 Equipos">

          {datos.laptops?.map((item, index) => (

            <CardActivo
              key={index}
              titulo={`${item.MARCA} ${item.MODELO}`}
              subtitulo={item.HOSTNAME}
            />

          ))}

        </Seccion>

        {/* CELULARES */}

        <Seccion titulo="📱 Celulares">

          {datos.celulares?.map((item, index) => (

            <CardActivo
              key={index}
              titulo={`${item.MARCA} ${item.MODELO}`}
              subtitulo={item["NÚM ASIGNADO"]}
            />

          ))}

        </Seccion>

        {/* CHIPS */}

        <Seccion titulo="📞 Chips">

          {datos.chips?.map((item, index) => (

            <CardActivo
              key={index}
              titulo={item["NÚMERO ASIGNADO"]}
              subtitulo={item["ESTADO"]}
            />

          ))}

        </Seccion>

      </div>

    </div>

  );

}

function ResumenCard({
  titulo,
  valor
}) {

  return (

    <div
      className="
        bg-slate-100
        rounded-2xl
        p-4
        text-center
      "
    >

      <div className="text-sm text-gray-500">

        {titulo}

      </div>

      <div className="text-3xl font-bold">

        {valor}

      </div>

    </div>

  );

}

function Seccion({
  titulo,
  children
}) {

  return (

    <div className="mb-8">

      <h2 className="text-2xl font-bold mb-4">

        {titulo}

      </h2>

      {children}

    </div>

  );

}

function InfoGrid({
  children
}) {

  return (

    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-4
      "
    >
      {children}
    </div>

  );

}

function Campo({
  label,
  value
}) {

  return (

    <div
      className="
        bg-slate-50
        border
        rounded-xl
        p-4
      "
    >

      <div className="text-xs text-gray-500">

        {label}

      </div>

      <div className="font-medium mt-1">

        {value || "-"}

      </div>

    </div>

  );

}

function CardActivo({
  titulo,
  subtitulo
}) {

  return (

    <div
      className="
        border
        rounded-2xl
        p-4
        mb-3
        bg-white
      "
    >

      <div className="font-bold">

        {titulo}

      </div>

      <div className="text-sm text-gray-500">

        {subtitulo}

      </div>

    </div>

  );

}

export default PerfilPersona;