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
      <ul>
        {characters.map((char, index) => (
          <li key={index}>
            <p>{char.name}</p>
          </li>
        ))}
      </ul>

      <div class="card" style="width: 18rem;">
        <img src="..." class="card-img-top" alt="..." />
        <div class="card-body">
          <h5 class="card-title">Card title</h5>
          <p class="card-text">
            Some quick example text to build on the card title and make up the
            bulk of the card’s content.
          </p>
          <a href="#" class="btn btn-primary">
            Go somewhere
          </a>
        </div>
      </div>
      
    </>
  );
};
