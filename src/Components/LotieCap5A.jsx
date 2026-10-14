import LottieModule from "lottie-react";
import { useRef, useEffect } from "react";

import edificio from "../assets/edificio.json";
import "../Styles/LotieCap5A.css";

const Lottie = LottieModule.default;


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

  // 2) Rejas abriéndose
  rejas: {
    archivo: "/audios/rejas.mp3",  
    inicio: 9,
    fin: null,
    volumen: 0.35,
  },

  // 3) Pasos: cuando empieza a caminar
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

  // Audio ambiente
  const sonidoAmbiente = useRef(new Audio(AMBIENTE.archivo));

  // Un Audio por cada sonido definido en SONIDOS
  const audios = useRef(
    Object.fromEntries(
      Object.entries(SONIDOS).map(([nombre, cfg]) => {
        const audio = new Audio(cfg.archivo);
        audio.volume = cfg.volumen;
        return [nombre, audio];
      })
    )
  );

  // Registra qué sonidos ya empezaron / terminaron
  const estado = useRef({});

  useEffect(() => {
    const ambiente = sonidoAmbiente.current;
    const audiosActuales = audios.current;

    ambiente.volume = AMBIENTE.volumen;
    ambiente.loop = true;

    // Los navegadores exigen un clic antes de reproducir audio
    const iniciarAmbiente = () => {
      ambiente.play().catch(() => {});
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
  };

  // Detiene los sonidos sincronizados (el ambiente NO se corta)
  const detenerSonidos = () => {
    Object.values(audios.current).forEach((a) => {
      a.pause();
      a.currentTime = 0;
    });
  };

  // Bucle de sincronización (el video de las rejas es el reloj maestro)
  const sincronizar = () => {
    const rejas = rejasRef.current;
    const step = videoRef.current;
    if (!rejas || !step) return;

    const t = rejas.currentTime;

    // Corrige desfases entre los dos videos
    if (Math.abs(step.currentTime - t) > 0.08) {
      step.currentTime = t;
    }

    // Dispara / detiene cada sonido según su tiempo
    Object.entries(SONIDOS).forEach(([nombre, cfg]) => {
      const est = estado.current[nombre];
      const audio = audios.current[nombre];

      if (!est.inicio && t >= cfg.inicio) {
        est.inicio = true;
        audio.currentTime = 0;
        audio.play().catch(() => {});
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

  // UN solo disparador para toda la escena
  const iniciarEscena = async () => {
    const rejas = rejasRef.current;
    const step = videoRef.current;
    if (!rejas || !step) return;

    cancelAnimationFrame(rafRef.current);
    detenerSonidos();

    // Asegura que el ambiente esté sonando
    if (sonidoAmbiente.current.paused) {
      sonidoAmbiente.current.play().catch(() => {});
    }

    // Reinicia el registro de sonidos
    estado.current = Object.fromEntries(
      Object.keys(SONIDOS).map((n) => [n, { inicio: false, fin: false }])
    );

    rejas.pause();
    step.pause();
    rejas.currentTime = 0;
    step.currentTime = 0;

    try {
      await Promise.all([rejas.play(), step.play()]);
    } catch (_) {}

    rafRef.current = requestAnimationFrame(sincronizar);
  };

  return (
    <div className="escena5a">
      <div className="camara5a">
        <img className="fondo5a" src="./Fondo5a.png" alt="" />

        <img className="nube1_5a" src="/nube1.png" alt="" />
        <img className="nube2_5a" src="/nube2.png" alt="" />
        <img className="nube3_5a" src="/nube3.png" alt="" />
        <img className="nube4_5a" src="/nube4.png" alt="" />

        <video
          ref={videoRef}
          className="stepc5a"
          muted
          playsInline
          preload="auto"
          onClick={iniciarEscena}
        >
          <source src="./caminado5.webm" type="video/webm" />
        </video>

        <div className="edificio5a" onClick={animarEdificio}>
          <Lottie
            lottieRef={edificioRef}
            animationData={edificio}
            autoplay={false}
            loop={false}
            rendererSettings={{ preserveAspectRatio: "none" }}
          />
        </div>

        <video
          ref={rejasRef}
          className="rejas5a"
          muted
          playsInline
          preload="auto"
          onClick={iniciarEscena}
        >
          <source src="./reja5c.webm" type="video/webm" />
        </video>
      </div>
    </div>
  );
};

export default LotieCap5A;