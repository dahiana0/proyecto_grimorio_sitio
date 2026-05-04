import React, { useState } from 'react'

//yamile 😒👌❤️😁😂
export const StatusGame = () => {
    const [puntos, setPuntos] = useState();
    const [vidas, setVidas] = useState(0);
    const [gemas, setGemas] = useState();
    const [character, setCharacter] = useState(0)

    return (
        <>
            <div className='puntos'>
                <h1>✅ puntos:____</h1>
                <button>Punto 1 </button>
                <button>Punto 2 </button>
                <button>Punto 3 </button>
            </div>
            <div className='vidas'>
                 <h1>🤩 vidas:{vidas}</h1>
                <button onClick={() => setVidas(prev => prev + 1)}> Vida Grimorio</button>
                <button onClick={() => setVidas(prev => prev + 1)}> Vida Stephen</button>
                <button onClick={() => setVidas(prev => prev + 1)}> Vida Museo</button>
            </div>
            <div className='gemas '>
               <h1>💎 Gemas:____</h1>
                <button> Gemas 1</button>
                <button> Gemas 2</button>
                <button> Gemas 3</button>
            </div>
            <div className='characters'>
                <h1>🚀 Character: {character}</h1>
                <button onClick={() => setCharacter(prev => prev + 1)}> R2D2</button>
                <button onClick={() => setCharacter(prev => prev + 3)}> Doc Emmet Brown</button>
                <button onClick={() => setCharacter(prev => prev + 2)}> Pikachu</button>
            </div>
        </>
    )

}

