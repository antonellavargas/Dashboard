import {
  HashRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Sidebar from "./components/Sidebar";

import DashboardGeneral from "./pages/DashboardGeneral";
import Celulares from "./pages/Celulares";
import Laptops from "./pages/Laptops";
import EquiposReportados from "./pages/EquiposReportados";
import Chips from "./pages/Chips";
import Modem from "./pages/Modem";
import Monitores from "./pages/Monitores";
import Impresoras from "./pages/Impresoras";
import Exchange from "./pages/Exchange";
import Trf from "./pages/Trf";
import DatacenterSI from "./pages/DatacenterSI";
import DatacenterPH from "./pages/DatacenterPH";
import DataPersonal from "./pages/DataPersonal";

function App() {

  return (

    <HashRouter>

      <div className="xl:flex min-h-screen bg-slate-100">

        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 xl:p-8 overflow-x-hidden">

          <Routes>

            <Route
              path="/"
              element={<Navigate to="/dashboard-general" />}
            />

            <Route path="/dashboard-general" element={<DashboardGeneral />} />
            <Route path="/data-personal" element={<DataPersonal />} />
            <Route path="/celulares" element={<Celulares />} />
            <Route path="/laptops" element={<Laptops />} />
            <Route path="/equipos-reportados" element={<EquiposReportados />} />
            <Route path="/chips" element={<Chips />} />
            <Route path="/modem" element={<Modem />} />
            <Route path="/monitores" element={<Monitores />} />
            <Route path="/impresoras" element={<Impresoras />} />
            <Route path="/exchange" element={<Exchange />} />
            <Route path="/trf" element={<Trf />} />
            <Route path="/datacenter-si" element={<DatacenterSI />} />
            <Route path="/datacenter-ph" element={<DatacenterPH />} />

          </Routes>

        </main>

      </div>

    </HashRouter>
  );
}

export default App;