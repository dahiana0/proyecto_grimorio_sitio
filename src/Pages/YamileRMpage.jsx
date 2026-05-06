import { useEffect, useState } from "react"

export const YamileRMpage = () => {

   const [characters, setCharacters] = useState([])

    const getCharacters = async () =>{

      const res = await fetch ("https://rickandmortyapi.com/api/character")
      const data = await res.json()
      setCharacters(data.results)
      console.log(data)

    }
    useEffect(() => {
      getCharacters()
    
    }, [])
    

    return(
        <>
        <h1>Personajes de Rick and Morty </h1>
        <ul>
            {characters.map( (char) => (
                <li key = {index}>
                    <p>{char.name}</p>
                </li>
            ))}
        </ul>
        </>
    )
}