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
      </Routes>

    </BrowserRouter>
    
    
    


     
          

      

      


      
     

      
    </>
  )
}