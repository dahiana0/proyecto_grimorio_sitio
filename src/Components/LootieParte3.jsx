import { useRef, useState } from "react";
import "../Styles/LootieParte3.css";

const LootieParte3 = () => {



  const [lampara1Activa, setLampara1Activa] = useState(false);
  const [lampara2Activa, setLampara2Activa] = useState(false);
  const [lampara3Activa, setLampara3Activa] = useState(false);



  const telarana1Ref = useRef(null);
  const telarana2Ref = useRef(null);

  const monstruo1Ref = useRef(null);
  const monstruo2Ref = useRef(null);
  const monstruo3Ref = useRef(null);
  const monstruo4Ref = useRef(null);

  const stepFrenteRef = useRef(null);
  const stepEspaldasRef = useRef(null);
  const stepLadoRef = useRef(null);


  const reproducirVideo = (ref) => {
    if (ref.current) {
      ref.current.pause();
      ref.current.currentTime = 0;
      ref.current.play();
    }
  };



  const moverLampara1 = () => {
    setLampara1Activa(false);

    setTimeout(() => {
      setLampara1Activa(true);

      setTimeout(() => {
        setLampara1Activa(false);
      }, 600);
    }, 10);
  };

  const moverLampara2 = () => {
    setLampara2Activa(false);

    setTimeout(() => {
      setLampara2Activa(true);

      setTimeout(() => {
        setLampara2Activa(false);
      }, 600);
    }, 10);
  };

  const moverLampara3 = () => {
    setLampara3Activa(false);

    setTimeout(() => {
      setLampara3Activa(true);

      setTimeout(() => {
        setLampara3Activa(false);
      }, 600);
    }, 10);
  };

  return (
    <div className="escena3">

      <img
        className="fondo3"
        src="/Fondo3.png"
        alt=""
      />



      <img
        src="/lampara1.png"
        alt=""
        className={`lampara1 ${lampara1Activa ? "moverLampara" : ""}`}
        onClick={moverLampara1}
      />

      <img
        src="/lampara1.png"
        alt=""
        className={`lampara2 ${lampara2Activa ? "moverLampara" : ""}`}
        onClick={moverLampara2}
      />

      <img
        src="/lampara1.png"
        alt=""
        className={`lampara3 ${lampara3Activa ? "moverLampara" : ""}`}
        onClick={moverLampara3}
      />


      <video
        ref={telarana1Ref}
        className="telarana1"
        muted
        playsInline
        preload="auto"
        onClick={() => reproducirVideo(telarana1Ref)}
      >
        <source src="/telarana1.webm" type="video/webm" />
      </video>

      <video
        ref={telarana2Ref}
        className="telarana2"
        muted
        playsInline
        preload="auto"
        onClick={() => reproducirVideo(telarana2Ref)}
      >
        <source src="/telarana2.webm" type="video/webm" />
      </video>



      <video
        ref={monstruo1Ref}
        className="monstruo1"
        muted
        playsInline
        preload="auto"
        onClick={() => reproducirVideo(monstruo1Ref)}
      >
        <source src="/monstruo1.webm" type="video/webm" />
      </video>

      <video
        ref={monstruo2Ref}
        className="monstruo2"
        muted
        playsInline
        preload="auto"
        onClick={() => reproducirVideo(monstruo2Ref)}
      >
        <source src="/monstruo2.webm" type="video/webm" />
      </video>

      <video
        ref={monstruo3Ref}
        className="monstruo3"
        muted
        playsInline
        preload="auto"
        onClick={() => reproducirVideo(monstruo3Ref)}
      >
        <source src="/monstruo3.webm" type="video/webm" />
      </video>

      <video
        ref={monstruo4Ref}
        className="monstruo4"
        muted
        playsInline
        preload="auto"
        onClick={() => reproducirVideo(monstruo4Ref)}
      >
        <source src="/monstruo4.webm" type="video/webm" />
      </video>


      <video
        ref={stepFrenteRef}
        className="stepFrente"
        muted
        playsInline
        preload="auto"
        onClick={() => reproducirVideo(stepFrenteRef)}
      >
        <source src="/stepFrente.webm" type="video/webm" />
      </video>

      <video
        ref={stepEspaldasRef}
        className="stepEspaldas"
        muted
        playsInline
        preload="auto"
        onClick={() => reproducirVideo(stepEspaldasRef)}
      >
        <source src="/stepEspaldas.webm" type="video/webm" />
      </video>

      <video
        ref={stepLadoRef}
        className="stepLado"
        muted
        playsInline
        preload="auto"
        onClick={() => reproducirVideo(stepLadoRef)}
      >
        <source src="/stepLado.webm" type="video/webm" />
      </video>

    </div>
  );
};

export default LootieParte3;