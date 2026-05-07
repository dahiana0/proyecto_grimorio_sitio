import React, { useEffect, useState } from 'react'

export function SofiaRMpage() {

  const [character, setCharacter] = useState([])
  const getCharacters = async () => {
    const res = await fetch("https://rickandmortyapi.com/api/character")
    const data = await res.json()
    setCharacter(data.results)
    console.log(data)
  }

  useEffect(() => {
    getCharacters()
  }, [])


  return (
    <>
      <h1> Personajes De Rick And Morty</h1>
      <ul>
        {character.map((char, index) => (
          <li key={index}>
            <p> {char.name}</p>
          </li>
        ))}
      </ul>
      
    </>

  )
}
