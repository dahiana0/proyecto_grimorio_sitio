import React, { useState } from 'react'

//yamile 😒👌❤️😁😂
export const StatusGame = () => {
    const [puntos, setPuntos] = useState(0);
    const [vidas, setVidas] = useState();
    const [gemas, setGemas] = useState();

    return (
        <>
            <div className='puntos'>
                <h1>✅ puntos:{puntos}</h1>
                <button onClick={() => setPuntos(prev => prev + 1)}>Puntos Comida</button>
                <button onClick={() => setPuntos(prev => prev + 1)}>Puntos Energia</button>
                <button onClick={() => setPuntos(prev => prev + 1)}>Puntos Ropa</button>
               
            </div>
            <div className='vidas'>
                 <h1>🤩 vidas:____</h1>
                <button>vidas 1 </button>
                <button>vidas 2 </button>
                <button>vidas 3 </button>
            </div>
            <div className='gemas '>
               <h1>💎 Gemas:____</h1>
                <button> Gemas 1</button>
                <button> Gemas 2</button>
                <button> Gemas 3</button>
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

