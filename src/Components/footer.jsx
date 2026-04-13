import React from "react";
import "../Styles/css.css";

export const Footer = () => {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#040f08",
        padding: "30px 0", 
      }}
    >
     
      <div className="container">
        
        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "#1c2a28",
            marginBottom: "20px",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#cfcfcf",
            fontFamily: "monospace",
            fontSize: "13px",
          }}
        >
          
          <div
            style={{
              fontFamily: "haus",
              color: "#fff",
              fontSize: "30px",
              textShadow: "0 0 6px #ffffff",
            }}
          >
            GRIMORIO
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              fontFamily: "monospace",
              fontSize: "10px",
            }}
          >
            <span style={{ letterSpacing: "2px" }}>
              © 2025 · LECTURA INMERSIVA DIGITAL
            </span>

            <div style={{ display: "flex", gap: "10px" }}>
              <img
                src="./brand-instagram.svg"
                alt="Instagram"
                style={{ width: "30px", cursor: "pointer" }}
              />

              <img
                src="./brand-tiktok.svg"
                alt="TikTok"
                style={{ width: "30px", cursor: "pointer" }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Footer;