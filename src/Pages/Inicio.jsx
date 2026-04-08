import React from "react";
import Header from "../Components/Header";
import Banner from "../Components/Banner";
import InicioHistoriaBasada from "../Components/InicioHistoriaBasada";
import VideoIntroductorio from "../Components/VideoIntroductorio";
import Footer from "../Components/footer";


export const Inicio = () => {
  return (
    <>
         <Header />
         <Banner />
         <InicioHistoriaBasada />
         <VideoIntroductorio />
         <Footer />
         
 
    </>
  );
};