import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../Styles/css.css";

export const InicioHistoriaBasada = () => {
  const imagenes = ["./Cerrado.png", "./Abierto .png"];

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % imagenes.length);
        setFade(true);
      }, 400);
    }, 2000);

    return () => clearInterval(intervalo);
  }, [imagenes.length]);

  return (
    <motion.div
      className="historia-container d-flex justify-content-center align-items-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: false, amount: 0.3 }}
    >
      <div className="historia-content d-flex align-items-center justify-content-center">

        {/* Imagen */}
        <motion.img
          src={imagenes[index]}
          alt="Libro animado"
          className={`historia-img ${fade ? "fade-in" : "fade-out"}`}
          initial={{
            opacity: 0,
            x: -120,
            rotate: -8,
            scale: 0.8,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
            rotate: 0,
            scale: 1,
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
          }}
          viewport={{ once: false }}
        />

        {/* Texto */}
        <motion.div
          className="historia-text"
          initial={{
            opacity: 0,
            x: 120,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 1,
            delay: 0.3,
          }}
          viewport={{ once: false }}
        >
          <p className="historia-subtitle">
            Historia Basada En
          </p>

          <h1 className="historia-title">
            "El Horror En El Museo" 1933
          </h1>

          <p className="historia-desc">
            Inspirado en el relato de H. P. Lovecraft y Hazel Heald, esta
            historia nos lleva a un inquietante museo de cera donde nada es lo
            que parece. Las figuras, demasiado reales, parecen observarte…
            y esconden un secreto perturbador: quizá no siempre fueron solo cera.
          </p>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default InicioHistoriaBasada;