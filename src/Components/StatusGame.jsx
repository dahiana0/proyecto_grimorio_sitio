import React, { useState } from 'react'

//yamile 😒👌❤️😁😂
export const StatusGame = () => {
    const [puntos, setPuntos] = useState(0);
    const [vidas, setVidas] = useState(0);
    const [gemas, setGemas] = useState();
    const [character, setCharacter] = useState(0)

    return (
        <>
            <div className='puntos'>
                <h1>✅ puntos:{puntos}</h1>
                <button onClick={() => setPuntos(prev => prev + 1)}>Puntos Comida</button>
                <button onClick={() => setPuntos(prev => prev + 1)}>Puntos Energia</button>
                <button onClick={() => setPuntos(prev => prev + 1)}>Puntos Ropa</button>
               
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

