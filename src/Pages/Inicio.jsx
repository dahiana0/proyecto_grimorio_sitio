import React from "react";
import { motion } from "framer-motion";

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

      {/* Banner */}
      <motion.section
        className="inicio-banner"
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1.5,
          ease: "easeOut",
        }}
      >
        <Banner />
      </motion.section>

      {/* Historia */}
      <motion.section
        className="inicio-historia container py-5"
        initial={{ opacity: 0, y: 120 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <InicioHistoriaBasada />
      </motion.section>

      {/* Video */}
      <motion.section
        className="inicio-video container py-5"
        initial={{
          opacity: 0,
          scale: 0.85,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <VideoIntroductorio />
      </motion.section>

      <Footer />

    </div>
  );
};