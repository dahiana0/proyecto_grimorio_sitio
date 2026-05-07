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
            <div class="card" style="width: 18rem;">
                <img src="..." class="card-img-top" alt="..." />
                <div class="card-body">
                    <h5 class="card-title">Card title</h5>
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                    <a href="#" class="btn btn-primary">Go somewhere</a>
                </div>
            </div>
            <h1> Personajes De Rick And Morty👌</h1>
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
