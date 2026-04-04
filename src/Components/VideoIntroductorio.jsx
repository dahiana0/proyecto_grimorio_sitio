import React, { useState } from "react";
import "../Styles/css.css";

export const VideoIntroductorio = () => {
  const [play, setPlay] = useState(false);

  const videoURL = "https://www.youtube.com/embed/Jek5K3xqEFE";

  return (
    <div
      style={{
        width: "100%",
        padding: "80px 20px",
        backgroundColor: "#040f08",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      
      <h2
        style={{
          color: "#fff",
          fontFamily: "haus",
          fontSize: "50px",
          marginBottom: "40px",
          textAlign: "center",
         textShadow: "0 0 6px #ffffff",
        }}
      >
        VIDEO INTRODUCTORIO
      </h2>

    
      <div
        style={{
          width: "90%",
          maxWidth: "900px",
          height: "450px",
          borderRadius: "12px",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 0 20px rgba(0,0,0,0.6)",
          cursor: "pointer",
        }}
        onClick={() => setPlay(true)}
      >
        {!play ? (
          <>
           
            <img
              src="./Fondoinicio.png"
              alt="Video"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.6)",
              }}
            />

            
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                border: "2px solid #ffffff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backdropFilter: "blur(6px)",
              }}
            >
              
             
               <img src="./player-play.svg" style={{ width: "40px" }} /> 
            </div>

           
          </>
        ) : (
          <iframe
            width="100%"
            height="100%"
            src={videoURL + "?autoplay=1"}
            title="Video Intro"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
};

export default VideoIntroductorio;