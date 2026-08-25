import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/MapaCapitulo.css";

export const MapaCapitulos = () => {
  const navigate = useNavigate();

  // ---------------------------------------------------------------------
  // Datos de los capítulos
  // ---------------------------------------------------------------------
  // "objetos" son los ids que cada Lootie del capítulo guarda con
  // GuardarInteraccion (ver LootieKarol.jsx). Son la "misión" de ese
  // capítulo: interactuar con todos para completar el Grimorio.
  // Los capítulos que aún no están listos quedan con objetos: [].
  const capitulos = [
    {
      id: 1,
      titulo: "UMBRAL",
      descripcion:
        "Stephen Jones llega al misterioso Museo George Rogers decidido a descubrir la verdad detrás de los extraños sucesos que rodean el lugar. Sin imaginarlo, cruza el umbral hacia un mundo donde la razón deja de tener sentido.",
      imagen: "/Capitilo-1-img.png",
      ruta: "/cap-uno",
      clase: "btn1",
      objetos: ["tablero", "calavera", "step", "libro", "libroC"],
    },
    {
      id: 2,
      titulo: "RELIQUIAS",
      descripcion:
        "En las salas prohibidas del museo, Stephen encuentra antiguas reliquias y figuras inquietantes que esconden un oscuro pasado. Cada descubrimiento lo acerca más a un secreto que nunca debió ser revelado.",
      imagen: "/Capitulo-2-img.png",
      ruta: "/cap-dos",
      clase: "btn2",
      objetos: [],
    },
    {
      id: 3,
      titulo: "PRESAGIO",
      descripcion:
        "Lo inexplicable comienza a manifestarse. Sombras, presencias y fenómenos sobrenaturales anuncian que una fuerza ancestral ha despertado, convirtiendo la investigación en una auténtica pesadilla.",
      imagen: "/Capitulo-3-img.png",
      ruta: "/cap-tres",
      clase: "btn3",
      objetos: [],
    },
    {
      id: 4,
      titulo: "RITUAL",
      descripcion:
        "Rogers revela su verdadero propósito y somete a Stephen a un antiguo ritual. Mientras el museo cobra vida con extraños cánticos y entidades ocultas, escapar se convierte en su única esperanza.",
      imagen: "/Capitulo-4.png",
      ruta: "/cap-cuatro",
      clase: "btn4",
      objetos: [],
    },
    {
      id: 5,
      titulo: "REVELACIÓN",
      descripcion:
        "Rogers revela su verdadero propósito y somete a Stephen a un antiguo ritual. Mientras el museo cobra vida con extraños cánticos y entidades ocultas, escapar se convierte en su única esperanza.",
      imagen: "/Capitulo-5-img.png",
      ruta: "/cap-cinco",
      clase: "btn5",
      objetos: [],
    },
  ];

  const [capituloActivo, setCapituloActivo] = useState(capitulos[0]);

  // ---------------------------------------------------------------------
  // Interacciones guardadas (Grimorio): se leen de localStorage y se
  // actualizan solas cuando GuardarInteraccion dispara "grimorioActualizado"
  // ---------------------------------------------------------------------
  const [interacciones, setInteracciones] = useState([]);

  useEffect(() => {
    const cargarInteracciones = () => {
      const datos = localStorage.getItem("grimorio");
      setInteracciones(datos ? JSON.parse(datos) : []);
    };

    cargarInteracciones();

    window.addEventListener("grimorioActualizado", cargarInteracciones);

    return () => {
      window.removeEventListener("grimorioActualizado", cargarInteracciones);
    };
  }, []);

  // Progreso de la misión de un capítulo: cuántos de sus objetos ya
  // están guardados en el Grimorio.
  const calcularProgreso = (capitulo) => {
    const objetos = capitulo.objetos || [];
    const idsGuardados = interacciones.map((item) => item.id);
    const encontrados = objetos.filter((id) => idsGuardados.includes(id)).length;

    return { encontrados, total: objetos.length };
  };

  const progresoActivo = calcularProgreso(capituloActivo);
  const misionCompleta =
    progresoActivo.total > 0 && progresoActivo.encontrados === progresoActivo.total;
  const porcentajeActivo =
    progresoActivo.total > 0
      ? Math.round((progresoActivo.encontrados / progresoActivo.total) * 100)
      : 0;

  // Sonido
  const sonidoBoton = useRef(new Audio("./audios/sonidoboton.ogg"));

  const reproducirSonido = () => {
    sonidoBoton.current.currentTime = 0;
    sonidoBoton.current.play().catch(() => {});
  };

  const seleccionarCapitulo = (capitulo) => {
    reproducirSonido();
    setCapituloActivo(capitulo);
  };

  const irAlCapitulo = () => {
    reproducirSonido();

    setTimeout(() => {
      navigate(capituloActivo.ruta);
    }, 150);
  };

  return (
    <div className="Container-mapa">
      <div className="marco-pergamino">

        <div className="header-mapa">
          <div className="titulo-lado">
            <h1 className="titulo-mapa">Grimorio</h1>
            <span>MAPA DEL MUSEO</span>
          </div>
        </div>

        <div className="contenido-principal">

          <div className="zona-mapa">

            <div className="mapa">

              <img
                src="/Mapa-Grimorio.png"
                className="img-mapa"
                alt="Mapa"
              />

              {capitulos.map((capitulo) => (
                <div
                  key={capitulo.id}
                  className={`contenedor-btn ${capitulo.clase}`}
                >
                  <img
                    src={capitulo.imagen}
                    alt={capitulo.titulo}
                    className={`btn-mapa ${
                      capituloActivo.id === capitulo.id
                        ? `activo activo${capitulo.id}`
                        : ""
                    }`}
                    onClick={() => seleccionarCapitulo(capitulo)}
                  />
                </div>
              ))}

            </div>

            <div className="barra-capitulos">

              {capitulos.map((capitulo) => {
                const progreso = calcularProgreso(capitulo);

                return (
                  <div
                    key={capitulo.id}
                    className={`item-capitulo ${
                      capituloActivo.id === capitulo.id
                        ? `seleccionado seleccionado${capitulo.id}`
                        : ""
                    }`}
                    onClick={() => seleccionarCapitulo(capitulo)}
                  >
                    <img
                      src={capitulo.imagen}
                      alt={capitulo.titulo}
                      className={`icono-barra ${
                        capituloActivo.id === capitulo.id
                          ? `iconoBarra${capitulo.id}`
                          : ""
                      }`}
                    />

                    <p>{capitulo.titulo}</p>

                    {/* Mini indicador de misión: solo para capítulos con objetos definidos */}
                    {progreso.total > 0 && (
                      <span
                        className={`mini-progreso ${
                          progreso.encontrados === progreso.total
                            ? "mini-progreso-completo"
                            : ""
                        }`}
                      >
                        {progreso.encontrados}/{progreso.total}
                      </span>
                    )}
                  </div>
                );
              })}

            </div>

          </div>

          <div className="panel-capitulo">

            <div className={`panel-contenido panel${capituloActivo.id}`}>

              <img
                src="/Calavera.png"
                className="icono-panel"
                alt=""
              />

              <div className="imagen-panel">

                <img
                  src={capituloActivo.imagen}
                  alt={capituloActivo.titulo}
                  className={`icono-capitulo-panel icono${capituloActivo.id}`}
                />

              </div>

              <h2 className={`titulo-panel titulo${capituloActivo.id}`}>
                {capituloActivo.titulo}
              </h2>

              <div className={`linea linea${capituloActivo.id}`}></div>

              <p className="descripcion-panel">
                {capituloActivo.descripcion}
              </p>

              {/* Misión del capítulo: aprieta todos los objetos interactivos */}
              {progresoActivo.total > 0 ? (
                <div className="mision-capitulo">
                  <p className="mision-titulo">
                    <img
                      src="/Icono-Mision.png"
                      alt=""
                      className="icono-mision"
                    />
                    MISIÓN DEL CAPÍTULO
                  </p>

                  <p className="mision-texto">
                    Encuentra todos los objetos interactivos del capítulo.
                  </p>

                  <div className="mision-barra">
                    <div
                      className="mision-barra-fill"
                      style={{ width: `${porcentajeActivo}%` }}
                    />
                  </div>

                  <span className="mision-contador">
                    {progresoActivo.encontrados}/{progresoActivo.total} encontrados
                  </span>

                  {misionCompleta && (
                    <p className="mision-completa">✔ ¡Misión completada!</p>
                  )}

                  <Link
                    to="/archivo"
                    className="mision-link"
                    onClick={reproducirSonido}
                  >
                    Ver mi Grimorio
                  </Link>
                </div>
              ) : (
                <p className="mision-proximamente">
                  Este capítulo aún no está disponible para explorar.
                </p>
              )}

              <button
                className={`btn-vermas btn-ver${capituloActivo.id}`}
                onClick={irAlCapitulo}
              >
                VER MÁS
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default MapaCapitulos;