import { useEffect, useState } from "react"

export const YamileRMpage = () => {

   const [characters, setCharacters] = useState([])

    const getCharacters = async () =>{

      const res = await fetch ("https://rickandmortyapi.com/api/character")
      const data = await res.json()

      console.log(data)

    }
    useEffect(() => {
      getCharacters()
    
    }, [])
    

    return(
        <div> YamileRMpage </div>
    )
}