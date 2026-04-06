import React from "react";
import Header from "../Components/Header";
import TituloPersonajes from "../Components/TituloPersonajes";
import CardGrande from "../Components/CardGrande";
import Footer from "../Components/footer";


export const Personajes = () => {
  return (
    <>
      
      <div style={{ paddingTop: "100px" }}>
        <TituloPersonajes />
       
      </div>
      <div
        style={{
          width: "100%",
          paddingTop: "120px",
          paddingBottom: "60px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "25px",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "1200px",
          }}
        >
          <CardGrande
            nombre="STEPHEN JONES"
            rol="EL ESCÉPTICO"
            descripcion="Un hombre racional que no cree en lo sobrenatural..."
            imagen="./stephen.jpg"
            tipo="Protagonista"
            rasgo="Racional"
          />

          <CardGrande
            nombre="GEORGE ROGERS"
            rol="EL CURADOR"
            descripcion="Dueño del museo de cera..."
            imagen="./rogers.jpg"
            tipo="Antagonista"
            rasgo="Obsesivo"
          />

          <CardGrande
            nombre="ORABONA"
            rol="EL ENIGMA"
            descripcion="El socio silencioso de Rogers. Misterioso y Raro..."
            imagen="./orabona.jpg"
            tipo="Misterioso"
            rasgo="Aliado"
          />

          <CardGrande
            nombre="CTHULHU"
            rol="El Horror"
            descripcion="Un ser informe y tentacular. El verdadero secreto del museo… y la"
            imagen="./cthulhu.jpg"
            tipo="Cósmico"
            rasgo="Entidad"
          />
        </div>
      </div>
     

    </>
  );
};

