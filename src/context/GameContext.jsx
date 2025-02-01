import { createContext, useContext, useState } from 'react'
import useSound from 'use-sound'
const GameContext = createContext()
import urlSound from "../audio/musica-fondo.mp3"

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
        if(letra && !existe(letra)) {
            letrasGlobal = [...letrasGlobal, letra]
            setLetras(letrasGlobal)
        } else if(letra && letra.isPrimera() && letrasGlobal.length>0){
            letrasGlobal = [letra]
            setLetras(letrasGlobal)
        }
    }

    const existe = (letra) =>{
        for(const l of letrasGlobal) {
            if (l.origen.toString() === letra.origen.toString()) {
                return true
            }
        }
        return false
    }

    const reset = () => {
        letrasGlobal = []
        setLetras(letrasGlobal)
    }

    return <GameContext.Provider value={{
        letras,
        onToggleMusica,
        addLetra,
        reset
    }}>
        {children}
    </GameContext.Provider>
}
