import {
  LayoutDashboard,
  Laptop,
  Smartphone,
  Monitor,
  Printer,
  Wifi,
  BadgeCheck,
  AlertTriangle,
  Cpu,
  HardDrive,
  Server,
  Database,
  Users,
  Menu
} from "lucide-react";

import { Link } from "react-router-dom";
import { useState } from "react";

function Sidebar() {

  const [open, setOpen] = useState(false);

  const menus = [

    {
      nombre: "Dashboard",
      ruta: "/dashboard-general",
      icono: <LayoutDashboard size={20} />
    },
    
    {
      nombre: "Data Personal",
      ruta: "/data-personal",
      icono: <Users size={20} />
    },
    {
      nombre: "Celulares",
      ruta: "/celulares",
      icono: <Smartphone size={20} />
    },

    {
      nombre: "Laptops",
      ruta: "/laptops",
      icono: <Laptop size={20} />
    },

    {
      nombre: "Equipos Reportados",
      ruta: "/equipos-reportados",
      icono: <AlertTriangle size={20} />
    },

    {
      nombre: "Impresoras",
      ruta: "/impresoras",
      icono: <Printer size={20} />
    },
    
    {
      nombre: "Monitores",
      ruta: "/monitores",
      icono: <Monitor size={20} />
    },

    {
      nombre: "Datacenter SI",
      ruta: "/datacenter-si",
      icono: <Server size={20} />
    },

    {
      nombre: "Datacenter PH",
      ruta: "/datacenter-ph",
      icono: <Database size={20} />
    },

    {
      nombre: "Chips",
      ruta: "/chips",
      icono: <Cpu size={20} />
    },

    {
      nombre: "Modem",
      ruta: "/modem",
      icono: <Wifi size={20} />
    },

    {
      nombre: "TRF",
      ruta: "/trf",
      icono: <HardDrive size={20} />
    },
    
    {
      nombre: "Exchange",
      ruta: "/exchange",
      icono: <BadgeCheck size={20} />
    }

  ];

  return (

    <>

      {/* BOTÓN MOBILE */}
      <button
        onClick={() => setOpen(!open)}
        className="
          fixed
          top-4
          left-4
          z-50
          bg-slate-900
          text-white
          p-3
          rounded-xl
          shadow-xl
          xl:hidden
        "
      >

        <Menu size={22} />

      </button>

      {/* OVERLAY MOBILE */}
      {open && (

        <div
          onClick={() => setOpen(false)}
          className="
            fixed
            inset-0
            bg-black/40
            z-30
            xl:hidden
          "
        />

      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed xl:static
          top-0 left-0
          h-screen
          w-72
          bg-slate-900
          text-white
          p-6
          z-40
          transition-transform
          duration-300
          overflow-y-auto

          ${open
            ? "translate-x-0"
            : "-translate-x-full xl:translate-x-0"}
        `}
      >

        {/* LOGO */}
        <div className="mb-10">

          <h1 className="text-3xl font-bold">
            Inventario TI
          </h1>

          <p className="text-slate-400 mt-2 text-sm">
            Dashboard Ejecutivo
          </p>

        </div>

        {/* MENÚ */}
        <div className="space-y-2">

          {menus.map((menu) => (

            <Link
              key={menu.nombre}
              to={menu.ruta}
              onClick={() => setOpen(false)}
              className="
                flex
                items-center
                gap-3
                p-4
                rounded-2xl
                hover:bg-white/10
                transition
                duration-200
              "
            >

              {menu.icono}

              <span className="font-medium">
                {menu.nombre}
              </span>

            </Link>

          ))}

        </div>

      </aside>

    </>

  );
}

export default Sidebar;