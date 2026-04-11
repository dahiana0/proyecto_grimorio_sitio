import React, { useState } from "react";
import "../Styles/css.css";

export const VideoIntroductorio = () => {
  const [play, setPlay] = useState(false);

  const videoURL = "https://www.youtube.com/embed/Jek5K3xqEFE";

  return (
    <div className="video-container d-flex flex-column align-items-center">

      <h2 className="video-title">
        VIDEO INTRODUCTORIO
      </h2>

      <div
        className="video-box"
        onClick={() => setPlay(true)}
      >
        {!play ? (
          <>
            <img
              src="./Fondoinicio.png"
              alt="Video"
              className="video-img"
            />

            <div className="video-play">
              <img src="./player-play.svg" className="video-icon" />
            </div>
          </>
        ) : (
          <iframe
            width="100%"
            height="100%"
            src={videoURL + "?autoplay=1"}
            title="Video Intro"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
};

export default VideoIntroductorio;