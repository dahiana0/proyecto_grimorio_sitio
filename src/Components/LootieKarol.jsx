import Lottie from "lottie-react";
import peloticaKarol from "../assets/data-Karol.json"


export const Inicio = () => {
  return (
    <div>
        <Lottie
        animationData={peloticaKarol}
        loop={true}
        style={{width:500, height: 500}}
        />
    </div>
  );
};