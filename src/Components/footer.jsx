import React from "react";
import "../Styles/Footer.css";


export const Footer = () => {
  return (
    <div className="footer-wrapper">
      <div className="container">
        <div className="footer-divider" />

        <div className="footer-inner">
          <div className="footer-logo">
            <img
              src="./Logo.svg"
              alt="Logo"
              style={{
                width: "170px",
                objectFit: "contain",
              }}
            />
          </div>

          <div className="footer-right">
            <span className="footer-copy">
              © 2025 · LECTURA INMERSIVA DIGITAL
            </span>

            <div className="footer-icons">
              <a
                href="https://www.instagram.com/tu_usuario"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="./instagram.png"
                  alt="Instagram"
                  className="footer-icon"
                />
              </a>

              <a
                href="https://www.tiktok.com/@tu_usuario"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="./Tik tok.png"
                  alt="TikTok"
                  className="footer-icon"
                />
              </a>

              <a
                href="https://www.facebook.com/tu_usuario"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="./Facebook.png"
                  alt="Facebook"
                  className="footer-icon"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;