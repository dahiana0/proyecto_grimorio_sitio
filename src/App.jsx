import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";


import Header from "./Components/Header";
import { Inicio } from "./Pages/Inicio";
import { SobreNosotros } from "./Pages/SobreNosotros";
import { Personajes } from "./Pages/Personajes";
import { Recomendaciones } from "./Pages/Recomendaciones";
import { ExplorarMuseo } from "./Pages/ExplorarMuseo";
import Banner from "./Components/Banner";
import CthulhuDescripcion from "./Components/CthulhuDescripcion";
import StepDescripcion from "./Components/StepDescripcion"
import RogersDescripcion from "./Components/RogersDescripcion"
import OrabonaDescripcion from "./Components/OrabonaDescripcion"
import PaginaComic1 from "./Components/PaginaComic1";
import PaginaComic2 from "./Components/PaginaComic2";
import PaginaComic3 from "./Components/PaginaComic3";
import PaginaComic4 from "./Components/PaginaComic4";
import PaginaComic5 from "./Components/PaginaComic5";
import VisorComic1 from "./Components/VisorComic1";
import VisorComic2 from "./Components/VisorComic2";
import VisorComic3 from "./Components/VisorComic3";
import VisorComic4 from "./Components/VisorComic4";
import VisorComic5 from "./Components/VisorComic5";
import Footer from "./Components/footer";

 
export const App = () => {
  return (
    <>
     
    <BrowserRouter>
    
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/sobrenosotros" element={<SobreNosotros />} />
        <Route path="/personajes" element={<Personajes />} />
        <Route path="/Recomendaciones" element={<Recomendaciones />} />
        <Route path="/explorarmuseo" element={<ExplorarMuseo />} />
        <Route path="/explorar-museo" element={<ExplorarMuseo />} />
        <Route path="/step" element={<StepDescripcion />} />
        <Route path="/rogers" element={<RogersDescripcion />} />
        <Route path="/orabona" element={<OrabonaDescripcion />} />
        <Route path="/cthulhu" element={<CthulhuDescripcion />} />
        <Route path="/cap-uno" element={<PaginaComic1 />} />
        <Route path="/cap-dos" element={<PaginaComic2 />} />
        <Route path="/cap-tres" element={<PaginaComic3 />} />
        <Route path="/cap-cuatro" element={<PaginaComic4 />} />
        <Route path="/cap-cinco" element={<PaginaComic5 />} />
        <Route path="/visor-1" element={<VisorComic1 />} />
        <Route path="/visor-2" element={<VisorComic2 />} />
        <Route path="/visor-3" element={<VisorComic3 />} />
        <Route path="/visor-4" element={<VisorComic4 />} />
        <Route path="/visor-5" element={<VisorComic5 />} />
      

      </Routes>

    </BrowserRouter>
    
    
    


     
          

      

      


      
     

      
    </>
  )
}