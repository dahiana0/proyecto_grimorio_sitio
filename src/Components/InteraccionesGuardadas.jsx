import { useEffect, useState } from "react";
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

  const [interacciones, setInteracciones] = useState([]);

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


  const eliminarInteraccion = (id) => {

    const nuevas = interacciones.filter(
      item => item.id !== id
    );

    setInteracciones(nuevas);

    localStorage.setItem(
      "grimorio",
      JSON.stringify(nuevas)
    );

  };


  const limpiarGrimorio = () => {

    if (
      !window.confirm("¿Deseas borrar todas las interacciones?")
    ) return;

    localStorage.removeItem("grimorio");

    setInteracciones([]);

  };


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

  return (

    <section className="grimorio">

      <div className="madera">

        <div className="pergamino">

          <div className="encabezado">

            <h1>INTERACCIONES GUARDADAS</h1>

            <p>
              Tu colección de descubrimientos dentro del Grimorio.
            </p>

          </div>

          <div className="informacion">

            <span>

              Total guardadas:

              <strong>
                {" "}
                {interacciones.length}
              </strong>

            </span>

            {

              interacciones.length > 0 && (

                <button
                  className="btnLimpiar"
                  onClick={limpiarGrimorio}
                >
                  Vaciar Grimorio
                </button>

              )

            }

          </div>

          {

            interacciones.length === 0 && (

              <div className="vacio">

                <h2>
                  El Grimorio está vacío
                </h2>

                <p>
                  Explora el museo e interactúa con los objetos.
                </p>

              </div>

            )

          }

          <div className="contenedorTarjetas">

            {

              interacciones.map((item) => (

                <div
                  key={item.id}
                  className="tarjeta"
                >

                  <div className="imagenTarjeta">

                    {

                      animaciones[item.imagen] && (

                        <Lottie
                          animationData={animaciones[item.imagen]}
                          autoplay
                          loop
                        />

                      )

                    }

                  </div>

                  <div className="contenidoTarjeta">

                    <h3>{item.nombre}</h3>

                    <span>

                      {obtenerFecha(item.fecha)}

                    </span>

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

              ))

            }

          </div>

        </div>

      </div>

    </section>

  );

};

export default InteraccionesGuardadas;