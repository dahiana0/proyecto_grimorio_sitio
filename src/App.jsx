import React from "react";
import "./App.css";

import Header from "./Components/Header";
import { Inicio } from "./Pages/Inicio";
import { SobreNosotros } from "./Pages/SobreNosotros";
import { Personajes } from "./Pages/Personajes";
import CthulhuDescripcion from "./Components/CthulhuDescripcion";
import Footer from "./Components/footer";
 



export const App = () => {
  return (
    <>
     
    <Header/>
    <Inicio/>
    <SobreNosotros/>
    <Personajes/>
    <Footer/>
    


     
          

      

      


      
     

      
    </>
  )
}