import React, { useState } from 'react'
import { useEffect } from 'react'

export const SofiaRMpage = () => {

    const [characters, Setcharacters] = useState([])

    const getCharacters = async () => {

        const res = await fetch("https://rickandmortyapi.com/api/character")
        const data = await res.json()
        Setcharacters(data.results)
        console.log(data)

    }

    useEffect(() => {
        getCharacters

    }, [])


    return (
        <>
            <h1> Personajes de Rick and Morty </h1>
            <ul>
                {characters.map((char, index) => (

                    <li key={index}>
                        <p>{char.name}</p>
                    </li>
                ))}
            </ul>

        </>
    )
}
