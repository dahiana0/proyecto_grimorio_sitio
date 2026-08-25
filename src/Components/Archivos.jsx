import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LottieModule from "lottie-react";

import tablero from "../assets/tablero.json";
import calavera from "../assets/calavera.json";
import step from "../assets/step1.json";
import libroMesa from "../assets/libro mesa.json";
import libroCae from "../assets/libro cae.json";

import "../Styles/InteraccionesGuardadas.css";
import "../Styles/archivos.css";

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
            (item) => item.id !== id
        );
        setInteracciones(nuevas);
        localStorage.setItem(
            "grimorio",
            JSON.stringify(nuevas)
        );
    };



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

    const volverInicio = () => {
        navigate("/");
    };
    const volverComic = () => { navigate("/visor-1"); };
    return (
        <section className="grimorio">
            <div className="madera">
                <div className="pergamino">
                    <div className="volverInicio">
                        <button
                            className="btnVolver"
                            onClick={volverInicio}
                        >
                            Volver al inicio
                        </button>
                    </div>
                    <div className="volverComic">
                        <button className="btncomic"
                            onClick={volverComic} > Volver al cómic
                        </button>
                    </div>

                    <div className="encabezado">
                        <h1>
                            Archivos De Cada capitulo
                        </h1>
                        <p>
                            Tu colección de cada capitulo del Grimorio.
                        </p>
                    </div>

                    {interacciones.length === 0 && (
                        <div className="vacio">

                            <button
                                className="seccionCapitulo"
                                onClick={() => navigate("/cap-uno")}
                            >
                                Capítulo 1
                            </button>
                            <button
                                className="seccionCapitulo"
                                onClick={() => navigate("/cap-dos")}
                            >
                                Capítulo 2
                            </button>
                            <button
                                className="seccionCapitulo"
                                onClick={() => navigate("/cap-tres")}
                            >
                                Capítulo 3
                            </button>
                            <button
                                className="seccionCapitulo"
                                onClick={() => navigate("/cap-cuatro")}
                            >
                                Capítulo 4
                            </button>
                            <button
                                className="seccionCapitulo"
                                onClick={() => navigate("/cap-cinco")}
                            >
                                Capítulo 5
                            </button>

                        </div>
                    )}
                </div>
            </div>
        </section>
    )
};

export default InteraccionesGuardadas;