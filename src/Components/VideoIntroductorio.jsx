import React, { useRef, useState } from "react";
import "../Styles/css.css";

export const VideoIntroductorio = () => {
  const videoRef = useRef(null);
  const [play, setPlay] = useState(false);

  const handlePlayPause = () => {
    if (play) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlay(!play);
  };

  const handleForward = () => {
    videoRef.current.currentTime += 10;
  };

  const handleBackward = () => {
    videoRef.current.currentTime -= 10;
  };

  return (
    <div className="video-container">

      <h2 className="video-title">
        VIDEO INTRODUCTORIO
      </h2>

      <div className="grimorio-portal">
        <video
          ref={videoRef}
          className="video-player"
        >
          <source
            src="/VideoIntroductorio.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      <div className="video-controls">

        <button onClick={handleBackward}>
          <img
            src="/retroceder.png"
            alt="Retroceder"
          />
        </button>

        <button
          className="play-button"
          onClick={handlePlayPause}
        >
          <img
            src={play ? "/pause.png" : "/player-play.svg"}
            alt="Play Pause"
          />
        </button>

        <button onClick={handleForward}>
          <img
            src="/adelantar.png"
            alt="Adelantar"
          />
        </button>

      </div>

    </div>
  );
};

export default VideoIntroductorio;