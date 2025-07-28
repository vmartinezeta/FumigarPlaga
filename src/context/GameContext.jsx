import { createContext, useContext, useRef, useState } from 'react'
import useSound from 'use-sound'
import urlSound from "../audio/musica-fondo.mp3"


const GameContext = createContext()

export const useGame = () => {
    const context = useContext(GameContext)
    if (!context) {
        throw new TypeError()
    }
    return context
}

let letrasGlobal = []

export function GameProvider({ children }) {
    const [play, { stop }] = useSound(urlSound,{loop:true})
    const [toggleMusica, setToggleMusica] = useState(false)
    const [letras, setLetras] = useState([])
    const [index, setIndex] = useState(0)

    const next = () => {
        setIndex(index + 1)
    }

    const onToggleMusica = () => {
        const toggle = !toggleMusica
        if (toggle) {
            play()
        } else {
            stop()
        }

        setToggleMusica(toggle)
    }

    const addLetra = (letra) => {
        letrasGlobal = [...letrasGlobal, letra]
        setLetras(letrasGlobal)
    }

    const cancelarAnimacion = () => {
        setIndex(0);
        letrasGlobal = [];
        setLetras(letrasGlobal);
    }

    return <GameContext.Provider value={{
        letras,
        onToggleMusica,
        addLetra,
        cancelarAnimacion,
        next
    }}>
        {children}
    </GameContext.Provider>
}