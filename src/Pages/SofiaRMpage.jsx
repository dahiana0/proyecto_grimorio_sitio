import React, { useState } from 'react'
import { useEffect } from 'react'

export const SofiaRMpage = () => {

    const [characters, Setcharacters] = useState ([])

    const getCharacters = async() => {

        const res = await fetch( "https://rickandmortyapi.com/api/character")
        const data = res.json()

        console.log(data)

    }

    useEffect(() => {
      getCharacters

    }, [third])
     

  return (
    <div>SofiaRMpage</div>
  )
}
