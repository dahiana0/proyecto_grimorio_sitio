import { useEffect, useState } from "react";

export const YamileRMpage = () => {
  const [characters, setCharacters] = useState([]);

  const getCharacters = async () => {
    const res = await fetch("https://rickandmortyapi.com/api/character");
    const data = await res.json();
    setCharacters(data.results);
    console.log(data);
  };
  useEffect(() => {
    getCharacters();
  }, []);

  return (
    <>
      <h1>Personajes de Rick and Morty </h1>

      {characters.map((char, index) => (
        <div key={index} className="card" style={{width: "18rem"}}>
          <img src={char.image} className="card-img-top" alt="..." />
          <div className="card-body">

            <h5 className="card-title">{char.name}</h5>

            <p className="card-text">Status: {char.status}</p>
            <p className="card-text">Especie: {char.specie}</p>
           
          </div>
        </div>
      ))}
    </>
  );
};
