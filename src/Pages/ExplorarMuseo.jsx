import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/footer";
import CardCapitulo from "../Components/CardCapitulo";
import VolverInicio from "../Components/VolverInicio";
import TituloCapitulos from "../Components/TituloCapitulos";


export const ExplorarMuseo = () => {
    return (
        <>
            <div
                style={{
                    backgroundColor: "#040f08",
                    padding: "60px 40px",
                }}
            >
                <VolverInicio />
                <TituloCapitulos />

            </div>


            <div

                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "30px",
                    flexWrap: "wrap",
                    padding: "80px 20px",
                    backgroundColor: "#040f08",
                }}
            >
                <CardCapitulo
                    capitulo="CAPÍTULO I"
                    titulo="LA ENTRADA"
                    descripcion="Un visitante nocturno llega al museo..."
                    imagen="./Cap-1.jpg"
                />

                <CardCapitulo
                    capitulo="CAPÍTULO II"
                    titulo="LAS RELIQUIAS"
                    descripcion="En lo más profundo del museo..."
                    imagen="./Cap-2.jpg"
                />

                <CardCapitulo
                    capitulo="CAPÍTULO III"
                    titulo="EL DESPERTAR"
                    descripcion="La línea entre la cera y la carne..."
                    imagen="./Cap-3.jpg"
                />

                <CardCapitulo
                    capitulo="CAPÍTULO IV"
                    titulo="EL RITUAL"
                    descripcion="Bajo el museo, una cámara secreta..."
                    imagen="./Cap-4.jpg"
                />

                <CardCapitulo
                    capitulo="CAPÍTULO V"
                    titulo="LA ABOMINACIÓN"
                    descripcion="Lo que fue invocado ha despertado..."
                    imagen="./Cap-5.jpg"
                />
            </div>



        </>
    );
};