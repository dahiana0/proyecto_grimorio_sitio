import React from "react";

export const ReproductorYamile = () => {
  return (
    <>
      <h1>Reproductor Yamile</h1>
      <video width={700}>
        <source
          src="https://www.w3schools.com/Html/mov_bbb.mp4"
          type="video/mp4"
        />
      </video>

      <div>
        <button>Play</button>
        <button>Pause</button>
      </div>
    </>
  );
};
