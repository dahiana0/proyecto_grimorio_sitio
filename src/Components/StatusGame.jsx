import React, { useState } from 'react'

//yamile 😒👌❤️😁😂
export const StatusGame = () => {
  const [puntos, setPuntos] = useState();
  const [vidas, setVidas] = useState();
  const [gemas, setGemas] = useState();

  return (
    <div className='gemas '>
      <button> Gemas 1</button>
      <button> Gemas 2</button>
      <button> Gemas 3</button>
    </div>
  )
    
}

  