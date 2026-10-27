import LottieModule from "lottie-react";
import { useRef, useEffect } from "react";
import GuardarInteraccion from "./GuardarInteraccion";

import edificio from "../assets/edificio.json";
import "../Styles/LotieCap5A.css";

const Lottie = LottieModule.default;


const CAPITULO = 5;


const DEBUG = false;

const AMBIENTE = {
  archivo: "/audios/ambiente.mp3",
  volumen: 0.13,
};

const SONIDOS = {

  cintas: {
    archivo: "/audios/cinta.mp3",
    inicio: 3,
    fin: null,
    volumen: 0.35,
  },


  rejas: {
    archivo: "/audios/rejas.mp3",
    inicio: 9,
    fin: null,
    volumen: 0.35,
  },


  pasos: {
    archivo: "/audios/pasos.mp3",
    inicio: 10,
    fin: 16,
    volumen: 0.4,
  },
};

const LotieCap5A = () => {
  const edificioRef = useRef(null);
  const rejasRef = useRef(null);
  const videoRef = useRef(null);
  const rafRef = useRef(null);


  const sonidoAmbiente = useRef(new Audio(AMBIENTE.archivo));


  const audios = useRef(
    Object.fromEntries(
      Object.entries(SONIDOS).map(([nombre, cfg]) => {
        const audio = new Audio(cfg.archivo);
        audio.volume = cfg.volumen;
        return [nombre, audio];
      })
    )
  );


  const estado = useRef({});

  useEffect(() => {
    const ambiente = sonidoAmbiente.current;
    const audiosActuales = audios.current;

    ambiente.volume = AMBIENTE.volumen;
    ambiente.loop = true;


    const iniciarAmbiente = () => {
      ambiente.play().catch(() => { });
      window.removeEventListener("click", iniciarAmbiente);
    };

    window.addEventListener("click", iniciarAmbiente);

    return () => {
      ambiente.pause();
      ambiente.currentTime = 0;
      window.removeEventListener("click", iniciarAmbiente);
      cancelAnimationFrame(rafRef.current);
      Object.values(audiosActuales).forEach((a) => a.pause());
    };
  }, []);

  const animarEdificio = (e) => {
    e.stopPropagation();
    edificioRef.current?.stop();
    edificioRef.current?.play();

    GuardarInteraccion("edificio", "Edificio", "edificio", CAPITULO, "lottie");
  };


  const detenerSonidos = () => {
    Object.values(audios.current).forEach((a) => {
      a.pause();
      a.currentTime = 0;
    });
  };


  const sincronizar = () => {
    const rejas = rejasRef.current;
    const step = videoRef.current;
    if (!rejas || !step) return;

    const t = rejas.currentTime;


    if (Math.abs(step.currentTime - t) > 0.08) {
      step.currentTime = t;
    }


    Object.entries(SONIDOS).forEach(([nombre, cfg]) => {
      const est = estado.current[nombre];
      const audio = audios.current[nombre];

      if (!est.inicio && t >= cfg.inicio) {
        est.inicio = true;
        audio.currentTime = 0;
        audio.play().catch(() => { });
      }

      if (cfg.fin !== null && !est.fin && t >= cfg.fin) {
        est.fin = true;
        audio.pause();
      }
    });

    if (!rejas.ended) {
      rafRef.current = requestAnimationFrame(sincronizar);
    }
  };


  const iniciarEscena = async () => {
    const rejas = rejasRef.current;
    const step = videoRef.current;
    if (!rejas || !step) return;

    cancelAnimationFrame(rafRef.current);
    detenerSonidos();


    if (sonidoAmbiente.current.paused) {
      sonidoAmbiente.current.play().catch(() => { });
    }


    estado.current = Object.fromEntries(
      Object.keys(SONIDOS).map((n) => [n, { inicio: false, fin: false }])
    );

    rejas.pause();
    step.pause();
    rejas.currentTime = 0;
    step.currentTime = 0;

    try {
      await Promise.all([rejas.play(), step.play()]);
    } catch (_) { }

    rafRef.current = requestAnimationFrame(sincronizar);
  };


  const clicRejas = () => {
    iniciarEscena();
    GuardarInteraccion("rejas", "Rejas", "rejas", CAPITULO, "video", "/reja5c.webm");
  };


  const clicStep = () => {
    iniciarEscena();
    GuardarInteraccion("stepCamina", "Step caminando", "stepCamina", CAPITULO, "video", "/caminado5.webm");
  };

  return (
    <div className="escena5a">
      <div className={`camara5a${DEBUG ? " debug" : ""}`}>
        <img className="fondo5a" src="./Fondo5a.png" alt="" />

        <img className="nube1_5a" src="/nube1.png" alt="" />
        <img className="nube2_5a" src="/nube2.png" alt="" />
        <img className="nube3_5a" src="/nube3.png" alt="" />
        <img className="nube4_5a" src="/nube4.png" alt="" />


        <div className="anim5a edificio5a">
          <div className="vista5a">
            <Lottie
              lottieRef={edificioRef}
              animationData={edificio}
              autoplay={false}
              loop={false}
              rendererSettings={{ preserveAspectRatio: "none" }}
            />
          </div>


          <div className="hitbox5a" onClick={animarEdificio}>
            <span className="pista5a" />
          </div>
        </div>


        <div className="anim5a rejas5a">
          <div className="vista5a">
            <video
              ref={rejasRef}
              muted
              playsInline
              preload="auto"
            >
              <source src="./reja5c.webm" type="video/webm" />
            </video>
          </div>

          <div className="hitbox5a" onClick={clicRejas}>
            <span className="pista5a" />
          </div>
        </div>


        <div className="anim5a stepc5a">
          <div className="vista5a">
            <video
              ref={videoRef}
              muted
              playsInline
              preload="auto"
            >
              <source src="./caminado5.webm" type="video/webm" />
            </video>
          </div>

          <div className="hitbox5a" onClick={clicStep}>
            <span className="pista5a" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotieCap5A;