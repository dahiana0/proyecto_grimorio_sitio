import React from "react";
import Header from "../Components/Header";
import CardGrande  from "../Components/CardGrande";
import Footer from "../Components/footer";


export const Personajes = () => {
    return (
        <>
            <Header />
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)", // 🔥 2 columnas
                    gap: "30px",
                    maxWidth: "1200px",
                    margin: "0 auto",
                }}
            >
                <CardGrande
                    nombre="Stephen Jones"
                    rol="EL ESCÉPTICO"
                    descripcion="Un hombre racional que no cree en lo paranormal."
                    imagen="/imagenes/jones.jpg"
                />

                <CardGrande
                    nombre="George Rogers"
                    rol="EL CURADOR"
                    descripcion="Dueño del museo de cera con secretos oscuros."
                    imagen="/imagenes/rogers.jpg"
                />

                <CardGrande
                    nombre="Orabona"
                    rol="EL ENIGMA"
                    descripcion="Un socio silencioso con un pasado misterioso."
                    imagen="/imagenes/orabona.jpg"
                />

                <CardGrande
                    nombre="Cthulhu"
                    rol="EL HORROR"
                    descripcion="Una entidad cósmica más allá de la comprensión."
                    imagen="/imagenes/cthulhu.jpg"
                />
            </div>

            <Footer />

        </>
    );
};

