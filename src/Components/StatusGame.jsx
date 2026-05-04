import React, { useState } from 'react'

//yamile 😒👌❤️😁😂
export const StatusGame = () => {
    const [puntos, setPuntos] = useState();
    const [vidas, setVidas] = useState();
    const [gemas, setGemas] = useState();

    return (
        <>
            <div className='puntos'>
                <button>Punto 1 </button>
                <button>Punto 2 </button>
                <button>Punto 3 </button>
            </div>
            <div className='vidas'>
                <button>vidas 1 </button>
                <button>vidas 2 </button>
                <button>vidas 3 </button>
            </div>
            <div className='gemas '>
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

