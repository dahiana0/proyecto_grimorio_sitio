import React, { useRef, useState } from "react";
import "../Styles/css.css";

export default function VideoIntroductorio() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [play, setPlay] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePlayPause = () => {
    if (play) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setPlay(!play);
  };

  const handleTimeUpdate = () => {
    const value =
      (videoRef.current.currentTime /
        videoRef.current.duration) *
      100;

    setProgress(value || 0);
  };

  const handleProgressChange = (e) => {
    const value = e.target.value;

    videoRef.current.currentTime =
      (value / 100) *
      videoRef.current.duration;

    setProgress(value);
  };

  const handleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="video-wrapper"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="video-player"
        onTimeUpdate={handleTimeUpdate}
      >
        <source
          src="/VideoIntroductorio.mp4"
          type="video/mp4"
        />
      </video>

      <div
        className={`controls ${
          showControls ? "show" : ""
        }`}
      >
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="progress-bar"
        />

        <div className="controls-bottom">
          <div className="center-buttons">
            <button
              onClick={() =>
                (videoRef.current.currentTime -= 10)
              }
            >
              <img
                src="/icons8-rewind-50.png"
                alt="Retroceder"
              />
            </button>

            <button onClick={handlePlayPause}>
              <img
                src={
                  play
                    ? "/icons8-pause-50.png"
                    : "/icons8-play-50.png"
                }
                alt="Play"
              />
            </button>

            <button
              onClick={() =>
                (videoRef.current.currentTime += 10)
              }
            >
              <img
                src="/icons8-fast-forward-50.png"
                alt="Adelantar"
              />
            </button>
          </div>

          <button
            className="fullscreen-btn"
            onClick={handleFullscreen}
          >
            <img
              src={
                isFullscreen
                  ? "/icons8-pantalla-normal-50.png"
                  : "/icons8-pantalla-completa-50.png"
              }
              alt="Pantalla completa"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
