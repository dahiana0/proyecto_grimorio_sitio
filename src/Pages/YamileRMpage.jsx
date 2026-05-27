import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const YamileRMpage = () => {
  const [characters, setCharacters] = useState([]);

  const getCharacters = async () => {
    const res = await fetch("https://rickandmortyapi.com/api/character");
    const data = await res.json();

    setCharacters(data.results);
    console.log(data);
  };

  const [pokemons, setPokemons] = useState([]);

  const getPokemons = async () => {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=12");
    const data = await res.json();

    const detallesPokemon = await Promise.all(
      data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        const detalles = await res.json();

        return {
          id: detalles.id,
          name: detalles.name,
          image: detalles.sprites.other["official-artwork"].front_default,
          type: detalles.types[0].type.name,
        };
      }),
    );

    setPokemons(detallesPokemon);
    console.log(detallesPokemon);
  };

  useEffect(() => {
    getCharacters();
    getPokemons();
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          width: 100,
          height: 100,
          backgroundColor: "blue",
          borderRadius: 5,
        }}
      />

     {/*  <h1>Personajes de Rick and Morty ☠️ </h1>

      {characters.map((char, index) => (
        <div key={index} className="card" style={{ width: "18rem" }}>
          <img src={char.image} className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">{char.name}</h5>
            <p className="card-text">Status: {char.status}</p>
            <p className="card-text">Especie: {char.specie}</p>
          </div>
        </div>
      ))}

      <h1>Card De Pokemons Yamile </h1>
      <div className="container">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {pokemons.map((poke, index) => (
            <div key={index} className="card" style={{ width: "18rem" }}>
              <img src={poke.image} className="card-img-top" alt="..." />

              <div className="card-body">
                <h5 className="card-title">{poke.name}</h5>
                <p className="card-text">Status: {poke.type}</p>
                <p className="card-text">Especie: {poke.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </>
  );
};


