import React, { useState } from 'react'

//yamile 😒👌❤️😁😂
export const StatusGame = () => {
    const [puntos, setPuntos] = useState();
    const [vidas, setVidas] = useState();
    const [gemas, setGemas] = useState(0);

    return (
        <>
            <div className='puntos'>
                <h1>✅ puntos:____</h1>
                <button>Punto 1 </button>
                <button>Punto 2 </button>
                <button>Punto 3 </button>
            </div>
            <div className='vidas'>
                 <h1>🤩 vidas:____</h1>
                <button>vidas 1 </button>
                <button>vidas 2 </button>
                <button>vidas 3 </button>
            </div>
            <div className='gemas '>
               <h1>💎 Gemas:{gemas}</h1>
                <button onClick={() => setGemas (prev => prev + 1)}> Gemas de Rubi</button>
                <button onClick={() => setGemas (prev => prev + 1)}> Gemas de Esmeralda</button>
                <button onClick={() => setGemas (prev => prev + 1)}> Gemas de Cuarso</button>
            </div>
            <div className='characters'>
                <h1>🚀 Character: ____</h1>
                <button> Character 1</button>
                <button> Character 2</button>
                <button> Character 3</button>
            </div>
        </>
    )

}

