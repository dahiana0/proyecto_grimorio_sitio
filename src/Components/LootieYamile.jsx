import Lottie from "lottie-react";
import peloticaYamile from "../assets/data-yamile.json";

export const LootieYamile = () => {
  return (
    <div>
      <Lottie
        animationData={peloticaYamile}
        loop={true}
        style={{ width: 500, height: 500 }}
      />
    </div>
  );
};
