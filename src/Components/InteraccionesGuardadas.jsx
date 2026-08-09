import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LottieModule from "lottie-react";

import tablero from "../assets/tablero.json";
import calavera from "../assets/calavera.json";
import step from "../assets/step1.json";
import libroMesa from "../assets/libro mesa.json";
import libroCae from "../assets/libro cae.json";

import "../Styles/InteraccionesGuardadas.css";

const Lottie = LottieModule.default;

const animaciones = {
  tablero,
  calavera,
  step,
  libro: libroMesa,
  libroC: libroCae,
};

const InteraccionesGuardadas = () => {

  const navigate = useNavigate();

  const [interacciones, setInteracciones] = useState([]);


  /* =====================================================
     CARGAR INTERACCIONES GUARDADAS
  ===================================================== */

  useEffect(() => {

    const cargarInteracciones = () => {

      const datos = localStorage.getItem("grimorio");

      if (datos) {

        setInteracciones(JSON.parse(datos));

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


  /* =====================================================
     ELIMINAR UNA INTERACCIÓN
  ===================================================== */

  const eliminarInteraccion = (id) => {

    const nuevas = interacciones.filter(
      (item) => item.id !== id
    );

    setInteracciones(nuevas);

    localStorage.setItem(
      "grimorio",
      JSON.stringify(nuevas)
    );

  };


  /* =====================================================
     VACIAR TODO EL GRIMORIO
  ===================================================== */

  const limpiarGrimorio = () => {

    if (
      !window.confirm(
        "¿Deseas borrar todas las interacciones?"
      )
    ) {
      return;
    }

    localStorage.removeItem("grimorio");

    setInteracciones([]);

  };


  /* =====================================================
     FORMATEAR FECHA
  ===================================================== */

  const obtenerFecha = (fecha) => {

    if (!fecha) return "";

    return new Date(fecha).toLocaleDateString(
      "es-CO",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

  };


  /* =====================================================
     VOLVER AL INICIO
  ===================================================== */

  const volverInicio = () => {

    navigate("/");

  };


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <section className="grimorio">

      <div className="madera">

        <div className="pergamino">


          {/* =================================================
              BOTÓN VOLVER AL INICIO
          ================================================= */}

          <div className="volverInicio">

            <button
              className="btnVolver"
              onClick={volverInicio}
            >

              ← Volver al inicio

            </button>

          </div>


          {/* =================================================
              ENCABEZADO
          ================================================= */}

          <div className="encabezado">

            <h1>
              INTERACCIONES GUARDADAS
            </h1>

            <p>
              Tu colección de descubrimientos dentro del Grimorio.
            </p>

          </div>


          {/* =================================================
              INFORMACIÓN
          ================================================= */}

          <div className="informacion">

            <span>

              Total guardadas:

              <strong>
                {" "}
                {interacciones.length}
              </strong>

            </span>


            {interacciones.length > 0 && (

              <button
                className="btnLimpiar"
                onClick={limpiarGrimorio}
              >

                🗑 Vaciar Grimorio

              </button>

            )}

          </div>


          {/* =================================================
              GRIMORIO VACÍO
          ================================================= */}

          {interacciones.length === 0 && (

            <div className="vacio">

              <h2>
                El Grimorio está vacío
              </h2>

              <p>
                Explora el museo e interactúa con los objetos.
              </p>

            </div>

          )}


          {/* =================================================
              TARJETAS
          ================================================= */}

          <div className="contenedorTarjetas">

            {interacciones.map((item) => (

              <div
                key={item.id}
                className="tarjeta"
              >


                {/* IMAGEN / LOTTIE */}

                <div className="imagenTarjeta">

                  {animaciones[item.imagen] && (

                    <Lottie
                      animationData={
                        animaciones[item.imagen]
                      }
                      autoplay
                      loop
                    />

                  )}

                </div>


                {/* CONTENIDO */}

                <div className="contenidoTarjeta">

                  <h3>
                    {item.nombre}
                  </h3>


                  <span>
                    {obtenerFecha(item.fecha)}
                  </span>


                  {/* ELIMINAR */}

                  <button
                    className="btnEliminar"
                    onClick={() =>
                      eliminarInteraccion(item.id)
                    }
                  >

                    ✕ Eliminar

                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>

  );

};

export default InteraccionesGuardadas;