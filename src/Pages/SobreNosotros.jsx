import React from "react";
import Header from "../Components/Header";
import BannerSobreNosotros from "../Components/BannerSobreNosotros";
import Footer from "../Components/footer";
import CardInfoS from "../Components/CardInfoS";
import CardEquipoFlip from "../Components/CardEquipoFlip";
import TituloEquipo from "../Components/TituloEquipo";


export const SobreNosotros = () => {
    return (
        <>
            <Header /> 
            <BannerSobreNosotros />
            <CardInfoS
                titulo="MISIÓN"
                texto="Crear experiencias digitales interactivas que despierten el interés de los jóvenes por la lectura, integrando elementos visuales, sonoros y narrativos."
                imagen="./book (3).svg"
            />

            <CardInfoS
                titulo="VISIÓN"
                texto="Convertirnos en una plataforma referente de lectura alternativa en Latinoamérica, donde la literatura pueda reimaginarse en formatos inmersivos."
                imagen="./eye (1).svg"
                derecha={true}
            />

            <CardInfoS
                titulo="PROPÓSITO"
                texto="Fomentar la lectura digital inmersiva. Llevar a los jóvenes más allá del simple acto de leer un texto — que se sientan parte de la historia."
                imagen="./compass.svg"
            />

            <CardInfoS
                titulo="Inspiración"
                texto="Basado en 'El Horror del Museo' (1933) de H.P. Lovecraft & Hazel Heald. Lo prohibido cobra vida en una experiencia interactiva."
                imagen="./sparkles-2 (3).svg"
                derecha={true}
            />
            <TituloEquipo />
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center", 
                    alignItems: "center",
                    gap: "40px",
                    flexWrap: "wrap",
                    marginTop: "40px",
                }}
            >

                <CardEquipoFlip
                    nombre="Sofía Amaya Reyes"
                    rol="DISEÑADORA PRINCIPAL"
                    descripcion="Experta en arte gótico y diseño UI/UX. Crea la identidad visual y la experiencia inmersiva."
                    imagen="./Sofia.jpeg"
                    iniciales="SA"
                />

                <CardEquipoFlip
                    nombre="Karol Dahiana Usuga"
                    rol="DESARROLLADORA LÍDER"
                    descripcion="Encargada del desarrollo técnico del proyecto."
                    imagen="./Karol.jpeg"
                    iniciales="KU"
                />

                <CardEquipoFlip
                    nombre="Yamile Arias Pérez"
                    rol="ARTISTA CONCEPTUAL"
                    descripcion="Creadora del estilo visual oscuro de Grimorio."
                    imagen="./Yamile.jpeg"
                    iniciales="YA"
                />
                 <Footer />
            </div>
            

        </>
    );
};