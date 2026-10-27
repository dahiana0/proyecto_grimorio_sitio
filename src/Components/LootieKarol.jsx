import { useRef, useEffect, useState } from "react";
import LottieModule from "lottie-react";
import GuardarInteraccion from "./GuardarInteraccion";

import tableroo from "../assets/tablero.json";
import calabera from "../assets/calavera.json";
import step from "../assets/step1.json";
import libroM from "../assets/libro mesa.json";
import libroc from "../assets/libro cae.json";

import "../Styles/LootieKarol.css";

const Lottie = LottieModule.default;


const ANCHO = 1500;
const ALTO = 836;


const DEBUG = false;

const LootieKarol = () => {
  const contenedorRef = useRef(null);
  const [escala, setEscala] = useState(1);

  const tableroRef = useRef(null);
  const calaveraRef = useRef(null);
  const stepRef = useRef(null);
  const libroRef = useRef(null);
  const libroCRef = useRef(null);

  const sonidoTablero = useRef(new Audio("/audios/tablero.mp3"));
  const sonidoCalavera = useRef(new Audio("/audios/calavera.mp3"));
  const sonidoLibro = useRef(new Audio("/audios/libro.mp3"));

  useEffect(() => {
    sonidoTablero.current.volume = 0.2;
    sonidoCalavera.current.volume = 0.2;
    sonidoLibro.current.volume = 0.35;
  }, []);

  // Ajusta la escala al tamaño del visor
  useEffect(() => {
    const el = contenedorRef.current;
    if (!el) return;

    const ajustar = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      setEscala(Math.min(width / ANCHO, height / ALTO));
    };

    ajustar();
    const ro = new ResizeObserver(ajustar);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const animarTablero = () => {
    sonidoTablero.current.currentTime = 0;
    sonidoTablero.current.play();

    tableroRef.current?.stop();
    tableroRef.current?.play();

    GuardarInteraccion("tablero", "Tablero de investigación", "tablero");
  };

  const animarCalavera = () => {
    sonidoCalavera.current.currentTime = 0;
    sonidoCalavera.current.play();

    calaveraRef.current?.stop();
    calaveraRef.current?.play();

    GuardarInteraccion("calavera", "Calavera", "calavera");
  };

  const animarStep = () => {
    stepRef.current?.stop();
    stepRef.current?.play();

    GuardarInteraccion("step", "Step", "step");
  };

  const animarLibro = () => {
    sonidoLibro.current.currentTime = 0;
    sonidoLibro.current.play();

    libroRef.current?.stop();
    libroRef.current?.play();

    GuardarInteraccion("libro", "Libro antiguo", "libro");
  };

  const animarLibroC = () => {
    libroCRef.current?.stop();
    libroCRef.current?.play();

    GuardarInteraccion("libroC", "Libro caído", "libroC");
  };

 
  const objetos = [
    { clase: "tablero",  lottieRef: tableroRef,  data: tableroo, onClick: animarTablero },
    { clase: "calavera", lottieRef: calaveraRef, data: calabera, onClick: animarCalavera },
    { clase: "step",     lottieRef: stepRef,     data: step,     onClick: animarStep },
    { clase: "libro",    lottieRef: libroRef,    data: libroM,   onClick: animarLibro },
    { clase: "libroC",   lottieRef: libroCRef,   data: libroc,   onClick: animarLibroC },
  ];

  return (
    <div className="escena1" ref={contenedorRef}>
      <div
        className="escenario"
        style={{ transform: `translate(-50%, -50%) scale(${escala})` }}
      >
        <div className={`camara${DEBUG ? " debug" : ""}`}>
          <img
            className="fondo"
            src="/Escenario-Oficina-Step-Final-1.png"
            alt="Fondo"
          />

          {objetos.map(({ clase, lottieRef, data, onClick }) => (
            <div key={clase} className={`anim ${clase}`}>
             
              <div className="vista">
                <Lottie
                  lottieRef={lottieRef}
                  animationData={data}
                  autoplay={false}
                  loop={false}
                />
              </div>

             
              <div className="hitbox" onClick={onClick}>
                <span className="pista" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LootieKarol;