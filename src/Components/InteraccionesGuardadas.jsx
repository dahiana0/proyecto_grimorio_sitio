import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LottieModule from "lottie-react";

import tablero from "../assets/tablero.json";
import calavera from "../assets/calavera.json";
import step from "../assets/step1.json";
import libroMesa from "../assets/libro mesa.json";
import libroCae from "../assets/libro cae.json";

import "../Styles/Interaccionesguardadas.css";
import "../Styles/css.css";

const Lottie = LottieModule.default;

const animaciones = {
  tablero,
  calavera,
  step,
  libro: libroMesa,
  libroC: libroCae,
};

// Cambia los títulos por los de tus capítulos
const capitulos = [
  { numero: 1, titulo: "Capítulo 1" },
  { numero: 2, titulo: "Capítulo 2" },
  { numero: 3, titulo: "Capítulo 3" },
  { numero: 4, titulo: "Capítulo 4" },
  { numero: 5, titulo: "Capítulo 5" },
];

const InteraccionesGuardadas = () => {

  const navigate = useNavigate();

  const [interacciones, setInteracciones] = useState([]);
  const [capituloActivo, setCapituloActivo] = useState(null);

  useEffect(() => {

    const cargarInteracciones = () => {

      const datos = localStorage.getItem("grimorio");

      if (datos) {
        // Las guardadas antes sin capítulo pasan al capítulo 1
        const lista = JSON.parse(datos).map((item) => ({
          ...item,
          capitulo: item.capitulo ?? 1,
        }));
        setInteracciones(lista);
      } else {
        setInteracciones([]);
      }

    };

    cargarInteracciones();

    window.addEventListener(
      "grimorioActualizado",
      cargarInteracciones
    );

    return () => {
      window.removeEventListener(
        "grimorioActualizado",
        cargarInteracciones
      );
    };

  }, []);

  const guardarLista = (lista) => {
    setInteracciones(lista);
    localStorage.setItem("grimorio", JSON.stringify(lista));
  };

  const eliminarInteraccion = (id, capitulo) => {
    const nuevas = interacciones.filter(
      (item) => !(item.id === id && item.capitulo === capitulo)
    );
    guardarLista(nuevas);
  };

  // Vacía solo el capítulo abierto, o todo si estás en la vista de capítulos
  const limpiarGrimorio = () => {

    const mensaje = capituloActivo
      ? `¿Deseas borrar las interacciones del capítulo ${capituloActivo}?`
      : "¿Deseas borrar todas las interacciones?";

    if (!window.confirm(mensaje)) return;

    if (capituloActivo) {
      guardarLista(
        interacciones.filter((item) => item.capitulo !== capituloActivo)
      );
    } else {
      localStorage.removeItem("grimorio");
      setInteracciones([]);
    }

  };

  const obtenerFecha = (fecha) => {

    if (!fecha) return "";

    return new Date(fecha).toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  };

  const contarPorCapitulo = (numero) =>
    interacciones.filter((item) => item.capitulo === numero).length;

  const volverInicio = () => {
    navigate("/");
  };

  const volverComic = () => {
    navigate("/visor-1");
  };

  const interaccionesVisibles = capituloActivo
    ? interacciones.filter((item) => item.capitulo === capituloActivo)
    : [];

  const tituloActivo = capitulos.find(
    (c) => c.numero === capituloActivo
  )?.titulo;

  const hayAlgoParaVaciar = capituloActivo
    ? interaccionesVisibles.length > 0
    : interacciones.length > 0;

  return (

    <section className="grimorio">

      <div className="madera">

        <div className="pergamino">

          <div className="volverInicio">
            <button className="btnVolver" onClick={volverInicio}>
              Volver al inicio
            </button>
          </div>

          <div className="volverComic">
            <button className="btncomic" onClick={volverComic}>
              Volver al cómic
            </button>
          </div>

          <div className="encabezado">

            <h1>
              {capituloActivo ? tituloActivo : "Interacciones Guardadas"}
            </h1>

            <p>
              {capituloActivo
                ? "Los descubrimientos de este capítulo."
                : "Elige un capítulo para ver tus descubrimientos dentro del Grimorio."}
            </p>

          </div>

          <div className="informacion">

            <span>
              Total guardadas:
              <strong>
                {" "}
                {capituloActivo
                  ? interaccionesVisibles.length
                  : interacciones.length}
              </strong>
            </span>

            <div className="accionesInfo">

              {capituloActivo && (
                <button
                  className="btnLimpiar"
                  onClick={() => setCapituloActivo(null)}
                >
                  ← Capítulos
                </button>
              )}

              {hayAlgoParaVaciar && (
                <button className="btnLimpiar" onClick={limpiarGrimorio}>
                  🗑 Vaciar {capituloActivo ? "capítulo" : "Grimorio"}
                </button>
              )}

            </div>

          </div>

          {/* VISTA 1: tarjetas de capítulos */}
          {!capituloActivo && (

            <div className="contenedorCapitulos">

              {capitulos.map((cap) => {

                const total = contarPorCapitulo(cap.numero);

                return (
                  <div
                    key={cap.numero}
                    className="tarjetaCapitulo"
                    onClick={() => setCapituloActivo(cap.numero)}
                  >
                    <span className="numeroCapitulo">{cap.numero}</span>

                    <h3>{cap.titulo}</h3>

                    <p className="contadorCapitulo">
                      {total} {total === 1 ? "interacción" : "interacciones"}
                    </p>
                  </div>
                );

              })}

            </div>

          )}

          {/* VISTA 2: interacciones del capítulo */}
          {capituloActivo && (

            <>

              {interaccionesVisibles.length === 0 && (

                <div className="mensajeVacio">
                  <h2>Este capítulo está vacío</h2>
                  <p>Vuelve al cómic e interactúa con los objetos.</p>
                </div>

              )}

              <div className="contenedorTarjetas">

                {interaccionesVisibles.map((item) => (

                  <div
                    key={`${item.capitulo}-${item.id}`}
                    className="tarjeta"
                  >

                    <div className="imagenTarjeta">

                      {animaciones[item.imagen] && (
                        <Lottie
                          animationData={animaciones[item.imagen]}
                          autoplay
                          loop
                        />
                      )}

                    </div>

                    <div className="contenidoTarjeta">

                      <h3>{item.nombre}</h3>

                      <span>{obtenerFecha(item.fecha)}</span>

                      <button
                        className="btnEliminar"
                        onClick={() =>
                          eliminarInteraccion(item.id, item.capitulo)
                        }
                      >
                        ✕ Eliminar
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </>

          )}

        </div>

      </div>

    </section>

  );

};

export default InteraccionesGuardadas;