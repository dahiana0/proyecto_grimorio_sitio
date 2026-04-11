import React from "react";
import Header from "../Components/Header";
import Banner from "../Components/Banner";
import InicioHistoriaBasada from "../Components/InicioHistoriaBasada";
import VideoIntroductorio from "../Components/VideoIntroductorio";
import Footer from "../Components/footer";
import "../Styles/css.css";

export const Inicio = () => {
  return (
    <div className="inicio-container">
      <Header />

      <section className="inicio-banner">
        <Banner />
      </section>

      <section className="inicio-historia container py-5">
        <InicioHistoriaBasada />
      </section>

      <section className="inicio-video container py-5">
        <VideoIntroductorio />
      </section>

      <Footer />
    </div>
  );
};