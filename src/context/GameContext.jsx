import { createContext, useContext, useRef, useState } from 'react'
import useSound from 'use-sound'
import urlSound from "../audio/musica-fondo.mp3"
import PropTypes from "prop-types"


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
    const [letra, setLetra] = useState(null)
    const tiempo = useRef(1000)


    const ultima = (l) => {
        setLetra(l)
    }

    const next = () => {
        setIndex(index + 1)
    }

    const resetIndex = () => {
        setIndex(0)
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

    const reset = () => {
        letrasGlobal = []
        setLetras(letrasGlobal)
    }

    return <GameContext.Provider value={{
        letra,
        letras,
        index,
        tiempo,
        onToggleMusica,
        addLetra,
        reset, 
        next,
        ultima,
        resetIndex
    }}>
        {children}
    </GameContext.Provider>
}


GameProvider.propTypes = {
    children: PropTypes.node
}