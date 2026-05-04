import React, { useState } from 'react'

//yamile 😒👌❤️😁😂
export const StatusGame = () => {
    const [gemas, setGemas] = useState(0);
    const [puntos, setPuntos] = useState(0);
    const [vidas, setVidas] = useState(0);
    const [character, setCharacter] = useState(0)

    return (
        <>
            <div className='puntos'>
                <h1 style={{color: "white"}}>✅ puntos:{puntos}</h1>
                <button onClick={() => setPuntos(prev => prev + 1)}>Puntos Comida</button>
                <button onClick={() => setPuntos(prev => prev + 1)}>Puntos Energia</button>
                <button onClick={() => setPuntos(prev => prev + 1)}>Puntos Ropa</button>
               
            </div>
            <div className='vidas'>
                 <h1 style ={{color: "white"}}>🤩 vidas:{vidas}</h1>
                <button onClick={() => setVidas(prev => prev + 1)}> Vida Grimorio</button>
                <button onClick={() => setVidas(prev => prev + 1)}> Vida Stephen</button>
                <button onClick={() => setVidas(prev => prev + 1)}> Vida Museo</button>
            </div>
            <div className='gemas '>
               <h1 style={{color: "white"}}>💎 Gemas:{gemas}</h1>
                <button onClick={() => setGemas (prev => prev + 1)}> Gemas de Rubi</button>
                <button onClick={() => setGemas (prev => prev + 1)}> Gemas de Esmeralda</button>
                <button onClick={() => setGemas (prev => prev + 1)}> Gemas de Cuarso</button>
            </div>
            <div className='characters'>
                <h1 style={{color: "white"}}>🚀 Character: {character}</h1>
                <button onClick={() => setCharacter(prev => prev + 1)}> R2D2</button>
                <button onClick={() => setCharacter(prev => prev + 3)}> Doc Emmet Brown</button>
                <button onClick={() => setCharacter(prev => prev + 2)}> Pikachu</button>
            </div>
        </>
    )

}

