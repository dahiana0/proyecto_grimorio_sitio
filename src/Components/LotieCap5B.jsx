import LottieModule from "lottie-react";
import { useRef, useEffect } from "react";

/* import estatua1 from "../assets/estatua1.json"; // TODO: ajusta los nombres de tus JSON
import estatua2 from "../assets/estatua2.json";
import estatua3 from "../assets/estatua3.json";
import estatua4 from "../assets/estatua4.json";
import estatua5 from "../assets/estatua5.json";
import estatua6 from "../assets/estatua6.json";
import lampara from "../assets/lampara.json";
import telarana1 from "../assets/telarana1.json";
import telarana2 from "../assets/telarana2.json";
import telarana3 from "../assets/telarana3.json"; */
import "../Styles/LotieCap5B.css";

const Lottie = LottieModule.default;

const LotieCap5B = () => {

 /*  const estatua1Ref = useRef(null);
  const estatua2Ref = useRef(null);
  const estatua3Ref = useRef(null);
  const estatua4Ref = useRef(null);
  const estatua5Ref = useRef(null);
  const estatua6Ref = useRef(null);
  const lamparaRef = useRef(null);
  const telarana1Ref = useRef(null);
  const telarana2Ref = useRef(null);
  const telarana3Ref = useRef(null);
  const videoRef = useRef(null);

  const sonidoAmbiente = useRef(new Audio("/audios/ambiente.mp3"));
  const sonidoPasos = useRef(new Audio("/audios/pasos.mp3")); */

 /*  useEffect(() => {

    sonidoAmbiente.current.volume = 0.15;
    sonidoPasos.current.volume = 0.40;

    sonidoAmbiente.current.loop = true;

    const iniciarAmbiente = () => {
      sonidoAmbiente.current.play().catch(() => { });
      window.removeEventListener("click", iniciarAmbiente);
    };

    window.addEventListener("click", iniciarAmbiente);

    return () => {
      sonidoAmbiente.current.pause();
      sonidoAmbiente.current.currentTime = 0;
      sonidoPasos.current.pause();
      window.removeEventListener("click", iniciarAmbiente);
    };

  }, []); */

 /*  const animarEstatua1 = () => {
    estatua1Ref.current?.stop();
    estatua1Ref.current?.play();
  };

  const animarEstatua2 = () => {
    estatua2Ref.current?.stop();
    estatua2Ref.current?.play();
  };

  const animarEstatua3 = () => {
    estatua3Ref.current?.stop();
    estatua3Ref.current?.play();
  };

  const animarEstatua4 = () => {
    estatua4Ref.current?.stop();
    estatua4Ref.current?.play();
  };

  const animarEstatua5 = () => {
    estatua5Ref.current?.stop();
    estatua5Ref.current?.play();
  };

  const animarEstatua6 = () => {
    estatua6Ref.current?.stop();
    estatua6Ref.current?.play();
  };

  const animarLampara = () => {
    lamparaRef.current?.stop();
    lamparaRef.current?.play();
  };

  const animarTelarana1 = () => {
    telarana1Ref.current?.stop();
    telarana1Ref.current?.play();
  };

  const animarTelarana2 = () => {
    telarana2Ref.current?.stop();
    telarana2Ref.current?.play();
  };

  const animarTelarana3 = () => {
    telarana3Ref.current?.stop();
    telarana3Ref.current?.play();
  }; */

  /* const animarVideo = () => {
    sonidoPasos.current.currentTime = 0;
    sonidoPasos.current.play().catch(() => { });

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }; */

  return (

    <div className="escena5b">

      <div className="camara5b">

     
        <img className="fondo5b" src="./Fondo5b.png" alt="" />

       
        {/* <div className="estatua1-5b" onClick={animarEstatua1}>
          <Lottie
            lottieRef={estatua1Ref}
            animationData={estatua1}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="estatua2-5b" onClick={animarEstatua2}>
          <Lottie
            lottieRef={estatua2Ref}
            animationData={estatua2}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="estatua3-5b" onClick={animarEstatua3}>
          <Lottie
            lottieRef={estatua3Ref}
            animationData={estatua3}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="estatua4-5b" onClick={animarEstatua4}>
          <Lottie
            lottieRef={estatua4Ref}
            animationData={estatua4}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="estatua5-5b" onClick={animarEstatua5}>
          <Lottie
            lottieRef={estatua5Ref}
            animationData={estatua5}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="estatua6-5b" onClick={animarEstatua6}>
          <Lottie
            lottieRef={estatua6Ref}
            animationData={estatua6}
            autoplay={false}
            loop={false}
          />
        </div>

       
        <div className="telarana1-5b" onClick={animarTelarana1}>
          <Lottie
            lottieRef={telarana1Ref}
            animationData={telarana1}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="telarana2-5b" onClick={animarTelarana2}>
          <Lottie
            lottieRef={telarana2Ref}
            animationData={telarana2}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="telarana3-5b" onClick={animarTelarana3}>
          <Lottie
            lottieRef={telarana3Ref}
            animationData={telarana3}
            autoplay={false}
            loop={false}
          />
        </div>

       
        <div className="lampara5b" onClick={animarLampara}>
          <Lottie
            lottieRef={lamparaRef}
            animationData={lampara}
            autoplay={false}
            loop={false}
          />
        </div>

      
        <video
          ref={videoRef}
          className="step5b"
          muted
          playsInline
          onClick={animarVideo}
        >
          <source src="/StepCap5b.webm" type="video/webm" />
        </video>
 */}
      </div>

    </div>

  );

};

export default LotieCap5B;