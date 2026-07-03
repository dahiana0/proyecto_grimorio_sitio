import React from "react";
import VolverInicio from "../Components/VolverInicio";
import TituloCapitulos from "../Components/TituloCapitulos";
import { MapaCapitulos } from "./MapaCapitulos";
import "../Styles/css.css";

export const ExplorarMuseo = () => {
  return (
    <>
      <div className="explorar-header container py-3 ">
        <VolverInicio />
      </div>

      <MapaCapitulos />
    </>
  );
};