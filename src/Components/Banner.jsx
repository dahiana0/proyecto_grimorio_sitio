import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../Styles/css.css";

export const Banner = () => {
  const navigate = useNavigate();

  const sonidoBoton = useRef(new Audio("./audios/sonidoboton.ogg"));

  const reproducirSonido = () => {
    sonidoBoton.current.currentTime = 0;
    sonidoBoton.current.play().catch(() => {});
  };

  const explorarMuseo = () => {
    reproducirSonido();

    setTimeout(() => {
      navigate("/guia");
    }, 150);
  };

  return (
    <div className="banner-container d-flex align-items-center justify-content-center">

      <div className="banner-overlay"></div>

      <motion.div
        className="banner-content text-center text-white"
        initial={{
          opacity: 0,
          y: 50,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1.2,
          ease: "easeOut",
        }}
      >

        <motion.p
          className="banner-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          SI TE ATREVES A ENTRAR
        </motion.p>

        <motion.h1
          className="banner-title"
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: 0.5,
            duration: 0.8,
          }}
        >
          GRIMORIO
        </motion.h1>

        <motion.p
          className="banner-text"
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.8,
            duration: 0.8,
          }}
        >
          Explora el Museo del Horror de Grimorio…
          y adéntrate en una historia que desafía la realidad,
          donde cada página revela secretos ocultos,
          y cada paso te acerca a algo que nunca debiste encontrar.
        </motion.p>

        <motion.button
          className="banner-btn"
          onClick={explorarMuseo}
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: 1.1,
            duration: 0.6,
          }}
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          EXPLORAR MUSEO
        </motion.button>

      </motion.div>

    </div>
  );
};

export default Banner;