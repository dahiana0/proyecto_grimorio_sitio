import React, { useState } from 'react'
import { useEffect } from 'react'

export const SofiaRMpage = () => {

    const [characters, Setcharacters] = useState ([])

    const getCharacters = async() => {

        const res = await fetch( "https://rickandmortyapi.com/api/character")
        const data = await res.json()

        console.log(data)

    }

    useEffect(() => {
      getCharacters

    }, [])
     

  return (
    <div>SofiaRMpage</div>
  )
}
