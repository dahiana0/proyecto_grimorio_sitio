import React, { useEffect } from "react";
import "@google/model-viewer";
import { useNavigate } from "react-router-dom";
import "../Styles/DescripcionStyles.css";

const MODELO_PRUEBA =
  "https://modelviewer.dev/shared-assets/models/Astronaut.glb";

const personajes = {
  cthulhu: {
    expediente: "001",
    nombre: "Cthulhu",
    modelo: "/models/result.glb",
    color: "#1ad96d",
    tags: ["Cósmico", "Entidad"],
    cita: "Un ser informe y tentacular. El verdadero secreto del museo… y la prueba de que algunos horrores no deberían existir.",
    desc: "Cthulhu no es simplemente una figura del museo: es la razón de su existencia. La entidad cósmica yace en un sueño eterno en las profundidades del océano, pero su influencia se extiende como tentáculos invisibles a través del tiempo y el espacio. El grimorio que Rogers encontró es un fragmento del Necronomicón, y los rituales que contiene sirven como puente entre nuestra realidad y la dimensión donde Cthulhu aguarda.",
  },

  orabona: {
    expediente: "002",
    nombre: "Orabona",
    modelo: MODELO_PRUEBA,
    color: "#1ad96d",
    tags: ["Misterioso", "Aliado"],
    cita: "El socio silencioso de Rogers. Misterioso y enigmático, siempre parece saber más de lo que muestra.",
    desc: "Orabona llegó al museo hace décadas, nadie sabe exactamente cuándo. Algunos dicen que fue el primer asistente del padre de Rogers, otros creen que estuvo allí antes que cualquier miembro de la familia. Habla poco, pero cuando lo hace, sus palabras tienen un peso que hiela la sangre. Conoce cada rincón del museo, cada secreto oculto tras sus paredes. Su lealtad a Rogers parece inquebrantable, pero hay momentos en que sus ojos revelan algo más.",
  },

  rogers: {
    expediente: "003",
    nombre: "George Rogers",
    modelo: MODELO_PRUEBA,
    color: "#1ad96d",
    tags: ["Antagonista", "Obsesivo"],
    cita: "Dueño del museo de cera. Fascinado desde niño por embalsamar y preservar, su pasión roza lo macabro.",
    desc: "George Rogers heredó el museo de su padre, un taxidermista excéntrico que dedicó su vida a preservar la belleza en la muerte. Desde niño, George mostró una fascinación perturbadora por la frontera entre lo vivo y lo inerte. Estudió química y anatomía, perfeccionando técnicas de preservación que superaban cualquier método conocido. Sus figuras de cera son tan realistas que visitantes han jurado verlas respirar. Pero el secreto de su arte no es la cera: Rogers descubrió un antiguo grimorio que contiene rituales para atrapar la esencia vital de los seres vivos.",
  },

  stephen: {
    expediente: "004",
    nombre: "Stephen Jones",
    modelo: MODELO_PRUEBA,
    color: "#1ad96d",
    tags: ["Protagonista", "Racional"],
    cita: "Un hombre racional y culto que no cree en lo sobrenatural… hasta que el museo le demuestra lo contrario.",
    desc: "Stephen Jones es un periodista y escritor reconocido por su pensamiento crítico y su escepticismo absoluto. Criado en una familia académica de Boston, siempre buscó respuestas racionales a los misterios del mundo. Cuando recibe una invitación anónima para visitar un museo de cera en una ciudad costera olvidada, su curiosidad lo lleva a aceptar. Lo que encuentra allí desafía todo lo que creía saber. Las figuras de cera parecen demasiado reales, los pasillos parecen cambiar de forma, y una presencia antigua lo acecha desde las sombras. A medida que descubre la verdad detrás del museo, Stephen debe enfrentarse a la posibilidad de que la razón no puede explicar todo lo que existe en el universo.",
  },
};

export const PersonajeDescripcion = ({ id }) => {
  const navigate = useNavigate();
  const p = personajes[id];

  const cerrar = () => navigate("/Personajes");

  // Cerrar con ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && navigate("/Personajes");
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  if (!p) return null;

  return (
    <div
      className="pj-overlay"
      style={{ "--accent": p.color }}
      onClick={cerrar}
    >
      <article
        className="pj-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`Ficha técnica de ${p.nombre}`}
      >
        {/* Cabecera de ficha */}
        <button onClick={cerrar} className="pj-close-btn" aria-label="Cerrar">
          <img src="/x.svg" alt="" />
        </button>

        <div className="pj-content">
          {/* ===== 3D ===== */}
          <div className="pj-stage">
            <div className="pj-glow" />
            <div className="pj-float">
              <model-viewer
                src={p.modelo}
                alt={p.nombre}
                auto-rotate
                auto-rotate-delay="0"
                rotation-per-second="25deg"
                camera-controls
                disable-zoom
                shadow-intensity="1"
                exposure="1.1"
                interaction-prompt="none"
              />
            </div>
            <p className="pj-hint">↻ ARRASTRA PARA GIRAR</p>
          </div>

          {/* ===== Datos ===== */}
          <div className="pj-text">
            <h1 className="pj-title">{p.nombre}</h1>

            <dl className="pj-specs">
              <div>
                <dt>Clasificación</dt>
                <dd className="pj-tags">
                  {p.tags.map((t) => (
                    <span key={t} className="pj-tag">
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>

            <blockquote className="pj-quote">“{p.cita}”</blockquote>

            <h2 className="pj-section">Descripción</h2>
            <p className="pj-desc">{p.desc}</p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PersonajeDescripcion;