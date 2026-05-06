import React, { useEffect, useState } from 'react'

export function KarolRMP() {

 const [character,setCharacter] = useState([])
 const getCharacters = async () => {
 const res = await fetch ("https://rickandmortyapi.com/api/character")
 const data = res.json()
 console.log(data)
 }

 useEffect(() => {
  getCharacters()
 }, [])
 

  return (

    <div>KarolRMP </div>
  )
}
