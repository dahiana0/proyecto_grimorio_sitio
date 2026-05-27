import React from "react";
import { StatusGame } from "./Components/StatusGame";
import { YamileRMpage } from "./Pages/YamileRMpage";
import { SofiaRMpage } from "./Pages/SofiaRMpage";
import { KarolRMP } from "./Pages/KarolRMP";
import { ReproductorSofia } from "./Components/ReproductorSofia";

export const AppMain = () => {
  return (
    <>
     {/*  <div>AppMain</div>
      <KarolRMP />
      <h1>ddgfr</h1>
      <YamileRMpage />
      <SofiaRMpage /> */}
      <ReproductorSofia/>
      <ReproductorYamile></ReproductorYamile>
    </>
  );
};
