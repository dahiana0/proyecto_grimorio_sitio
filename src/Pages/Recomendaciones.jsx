import React from "react";
import CardRecomendacion from "../Components/CardRecomendacion";
import TituloRecomendaciones from "../Components/TituloRecomendaciones";
import Header from "../Components/Header";
import Footer from "../Components/footer";
import "../Styles/css.css";

export const Recomendaciones = () => {
  return (
    <>
      <Header />
      <br />
      <div className="recomendaciones-section container">
        <TituloRecomendaciones />

        <br />

        <div className="recomendaciones-grid">
          <CardRecomendacion
            imagen="./La-llama.jpg"
            titulo="LA LLAMADA DE CTHULHU"
            autor="H.P. Lovecraft"
            anio="1928"
            descripcion="narra cómo Thurston descubre un culto que adora a Cthulhu, una entidad dormida en el mar. La criatura casi despierta, pero vuelve a quedar inactiva. Aterrorizado, decide no investigar más."
          />

          <CardRecomendacion
            imagen="./El-color.jpg"
            titulo="EL COLOR QUE CAYÓ DEL CIELO"
            autor="H.P. Lovecraft"
            anio="1927"
            descripcion="narra cómo un meteorito cae y libera un color extraño que contamina la tierra. La vegetación, los animales y las personas comienzan a deteriorarse. El fenómeno consume todo antes de desaparecer misteriosamente."
          />

          <CardRecomendacion
            imagen="./Las-Montañas.jpg"
            titulo="EN LAS MONTAÑAS DE LA LOCURA"
            autor="H.P. Lovecraft"
            anio="1936"
            descripcion="narra cómo una expedición en la Antártida descubre ruinas de una civilización antigua. Al explorarlas, encuentran criaturas y secretos aterradores sobre su origen. Horrorizados, comprenden el peligro y deciden no continuar la investigación."
          />

          <CardRecomendacion
            imagen="./El-Caso.jpg"
            titulo="EL CASO DE CHARLES DEXTER WARD"
            autor="H.P. Lovecraft"
            anio="1941"
            descripcion="narra cómo Charles Ward se obsesiona con su antepasado y practica rituales oscuros. Poco a poco cambia su comportamiento y su identidad. Finalmente, se descubre que algo siniestro ha tomado su lugar."
          />

          <CardRecomendacion
            imagen="./La-Sombra.jpg"
            titulo="LA SOMBRA SOBRE INNSMOUTH"
            autor="H.P. Lovecraft"
            anio="1936"
            descripcion="narra cómo un viajero llega a un pueblo aislado y descubre un culto extraño. Sus habitantes esconden un pacto con criaturas del mar. Al final, comprende que él también está ligado a ese destino."
          />

          <CardRecomendacion
            imagen="./Dagon.jpg"
            titulo="DAGON"
            autor="H.P. Lovecraft"
            anio="1919"
            descripcion="narra cómo un náufrago llega a una isla surgida del fondo del mar. Allí descubre un monolito antiguo y una criatura gigantesca. Aterrorizado por lo que vio, queda marcado por la experiencia."
          />
        </div>
      </div>

      <Footer />
    </>
  );
};