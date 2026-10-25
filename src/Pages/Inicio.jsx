import React from "react";

import Header from "../Components/Header";
import InicioDashboard from "../Components/InicioDashboard";

import "../Styles/css.css";
import "../Styles/fondo.css";

export const Inicio = () => {
  return (
    <div className="inicio-container fondo-museo">
      <Header />
      <InicioDashboard />
    </div>
  );
};

export default Inicio;