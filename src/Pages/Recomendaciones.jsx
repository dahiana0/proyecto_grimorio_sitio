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


        <div
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          <TituloRecomendaciones />
        </div>

        <br />


        <div className="recomendaciones-grid">


          <CardRecomendacion
            delay={100}
            imagen="./La-llama.jpg"
            titulo="La Llamada De Cthulhu"
            autor="H.P. Lovecraft"
            anio="1928"
            descripcion="Narra cómo Thurston descubre un culto que adora a Cthulhu, una entidad dormida en el mar. La criatura casi despierta, pero vuelve a quedar inactiva. Aterrorizado, decide no investigar más."
            pdf="./La llamada de Cthulhu - H. P. Lovecraft.pdf"
          />


          <CardRecomendacion
            delay={200}
            imagen="./El-color.jpg"
            titulo="El Color Que Cayó Del Cielo"
            autor="H.P. Lovecraft"
            anio="1927"
            descripcion="Narra cómo un meteorito cae y libera un color extraño que contamina la tierra. La vegetación, los animales y las personas comienzan a deteriorarse. El fenómeno consume todo antes de desaparecer misteriosamente."
            pdf="./El color que cayo del cielo - H. P. Lovecraft.pdf"
          />

          <CardRecomendacion
            delay={300}
            imagen="./Las-Montañas.jpg"
            titulo="En Las Montañas De La Locura"
            autor="H.P. Lovecraft"
            anio="1936"
            descripcion="Narra cómo una expedición en la Antártida descubre ruinas de una civilización antigua. Al explorarlas, encuentran criaturas y secretos aterradores sobre su origen. Horrorizados, comprenden el peligro y deciden no continuar la investigación."
            pdf="./En las montanas de la locura - H. P. Lovecraft.pdf"
          />


          <CardRecomendacion
            delay={400}
            imagen="./El-Caso.jpg"
            titulo="El Caso De Charles Dexter Ward"
            autor="H.P. Lovecraft"
            anio="1941"
            descripcion="Narra cómo Charles Ward se obsesiona con su antepasado y practica rituales oscuros. Poco a poco cambia su comportamiento y su identidad. Finalmente, se descubre que algo siniestro ha tomado su lugar."
            pdf="./El caso de Charles Dexter Ward - H. P. Lovecraft.pdf"
          />

          <CardRecomendacion
            delay={500}
            imagen="./La-Sombra.jpg"
            titulo="La Sombra Sobre Innsmouth"
            autor="H.P. Lovecraft"
            anio="1936"
            descripcion="Narra cómo un viajero llega a un pueblo aislado y descubre un culto extraño. Sus habitantes esconden un pacto con criaturas del mar. Al final, comprende que él también está ligado a ese destino."
            pdf="./La sombra sobre Innsmouth - H. P. Lovecraft.pdf"
          />


          <CardRecomendacion
            delay={600}
            imagen="./Dagon.jpg"
            titulo="Dagon"
            autor="H.P. Lovecraft"
            anio="1919"
            descripcion="Narra cómo un náufrago llega a una isla surgida del fondo del mar. Allí descubre un monolito antiguo y una criatura gigantesca. Aterrorizado por lo que vio, queda marcado por la experiencia."
            pdf="./Dagon-H._P._Lovecraft.pdf"
          />

        </div>
      </div>

      <Footer />
    </>
  );
};