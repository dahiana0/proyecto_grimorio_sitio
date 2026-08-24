import { useRef } from "react";
import LottieModule from "lottie-react";

import moustro1 from "../assets/moustro1.json";
import moustro2 from "../assets/moustro2.json";
import moustro3 from "../assets/moustro3.json";
import moustro4 from "../assets/moustro4.json"; 

/* import telarana1 from "../assets/telarana1.json";
import telarana2 from "../assets/telarana2.json";
import telarana3 from "../assets/telarana3.json";
import telarana4 from "../assets/telarana4.json";

import puerta from "../assets/puerta.json";
import stepCap3 from "../assets/step-cap-3.json";
 */
/* import antorcha1 from "../assets/antorcha1.json";
import antorcha2 from "../assets/antorcha2.json";
import antorcha3 from "../assets/antorcha3.json";
import antorcha4 from "../assets/antorcha4.json"; */

import "../Styles/LotieCap3.css";

const Lottie = LottieModule.default;

const LotieCap3 = () => {

  const moustro1Ref = useRef(null);
  const moustro2Ref = useRef(null);
  const moustro3Ref = useRef(null);
  const moustro4Ref = useRef(null); 
  
 /*  const telarana1Ref = useRef(null);
  const telarana2Ref = useRef(null);
  const telarana3Ref = useRef(null);
  const telarana4Ref = useRef(null);

  const puertaRef = useRef(null);

  const stepCap3Ref = useRef(null); */ 

 /*  const antorcha1Ref = useRef(null);
  const antorcha2Ref = useRef(null);
  const antorcha3Ref = useRef(null);
  const antorcha4Ref = useRef(null);
 */

  const animarLottie = (ref) => {

    if (!ref.current) return;

    ref.current.stop();
    ref.current.play();

  };

  /* const animarAntorcha1 = () => {
    animarLottie(antorcha1Ref);
  };

  const animarAntorcha2 = () => {
    animarLottie(antorcha2Ref);
  };

  const animarAntorcha3 = () => {
    animarLottie(antorcha3Ref);
  };

  const animarAntorcha4 = () => {
    animarLottie(antorcha4Ref);
  }; */


   const animarMoustro1 = () => {
    animarLottie(moustro1Ref);
  };

  const animarMoustro2 = () => {
    animarLottie(moustro2Ref);
  };

   const animarMoustro3 = () => {
    animarLottie(moustro3Ref);
  };

  const animarMoustro4 = () => {
    animarLottie(moustro4Ref);
  };   
 

  /* const animarTelarana1 = () => {
    animarLottie(telarana1Ref);
  };

  const animarTelarana2 = () => {
    animarLottie(telarana2Ref);
  };

  const animarTelarana3 = () => {
    animarLottie(telarana3Ref);
  };

  const animarTelarana4 = () => {
    animarLottie(telarana4Ref);
  }; */


  /* const animarPuerta = () => {
    animarLottie(puertaRef);
  }; */


  /* const animarStepCap3 = () => {
    animarLottie(stepCap3Ref);
  }; */


  return (

    <div className="contenedor-escena">

      <div className="escenacap3">


        <img
          className="fondo3"
          src="./Cap 3.png"
          alt="Escenario capítulo 3"
        />


        {/* <div
          className="antorcha antorcha1"
          onClick={animarAntorcha1}
        >

          <Lottie
            lottieRef={antorcha1Ref}
            animationData={antorcha1}
            autoplay={false}
            loop={true}
          />

        </div> */}


       {/*  <div
          className="antorcha antorcha2"
          onClick={animarAntorcha2}
        >

          <Lottie
            lottieRef={antorcha2Ref}
            animationData={antorcha2}
            autoplay={false}
            loop={true}
          />

        </div>
 */}

        {/* <div
          className="antorcha antorcha3"
          onClick={animarAntorcha3}
        >

          <Lottie
            lottieRef={antorcha3Ref}
            animationData={antorcha3}
            autoplay={false}
            loop={true}
          />

        </div> */}


       {/*  <div
          className="antorcha antorcha4"
          onClick={animarAntorcha4}
        >

          <Lottie
            lottieRef={antorcha4Ref}
            animationData={antorcha4}
            autoplay={false}
            loop={true}
          />

        </div> */}


         <div
          className="moustro moustro1c"
          onClick={animarMoustro1}
        >

          <Lottie
            lottieRef={moustro1Ref}
            animationData={moustro1}
            autoplay={false}
            loop={false}
          />

        </div> 


       

         <div
          className="moustro moustro2c"
          onClick={animarMoustro2}
        >

          <Lottie
            lottieRef={moustro2Ref}
            animationData={moustro2}
            autoplay={false}
            loop={false}
          />

        </div> 


       

         <div
          className="moustro moustro3c"
          onClick={animarMoustro3}
        >

          <Lottie
            lottieRef={moustro3Ref}
            animationData={moustro3}
            autoplay={false}
            loop={false}
          />

        </div> 


     

         <div
          className="moustro moustro4c"
          onClick={animarMoustro4}
        >

          <Lottie
            lottieRef={moustro4Ref}
            animationData={moustro4}
            autoplay={false}
            loop={false}
          />

        </div>  


 {/*        <div
  className="telarana telarana1c"
  onClick={animarTelarana1}
>
  <Lottie
    lottieRef={telarana1Ref}
    animationData={telarana1}
    autoplay={false}
    loop={false}
  />
</div>

<div
  className="telarana telarana2c"
  onClick={animarTelarana2}
>
  <Lottie
    lottieRef={telarana2Ref}
    animationData={telarana2}
    autoplay={false}
    loop={false}
  />
</div>

<div
  className="telarana telarana3c"
  onClick={animarTelarana3}
>
  <Lottie
    lottieRef={telarana3Ref}
    animationData={telarana3}
    autoplay={false}
    loop={false}
  />
</div>

<div
  className="telarana telarana4c"
  onClick={animarTelarana4}
>
  <Lottie
    lottieRef={telarana4Ref}
    animationData={telarana4}
    autoplay={false}
    loop={false}
  />
</div> */}


        {/* <div
          className="puerta"
          onClick={animarPuerta}
        >

          <Lottie
            lottieRef={puertaRef}
            animationData={puerta}
            autoplay={false}
            loop={false}
          />

        </div> */}



        {/* <div
          className="step-cap-3"
          onClick={animarStepCap3}
        >

          <Lottie
            lottieRef={stepCap3Ref}
            animationData={stepCap3}
            autoplay={false}
            loop={false}
          />

        </div> */}


      </div>

    </div>

  );
};

export default LotieCap3;