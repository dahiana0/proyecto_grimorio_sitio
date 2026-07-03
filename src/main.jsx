import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

// AOS
import AOS from "aos";
import "aos/dist/aos.css";

// Inicializar AOS
AOS.init({
  duration: 1000,
  once: true,
  easing: "ease-in-out",
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);