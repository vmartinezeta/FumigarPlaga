import { useRef, useState } from 'react'
import { PhaserGame } from './game/PhaserGame'
import { useGame } from './context/GameContext'
import "./estilos.css"
import LetraList from './Components/LetraList';

function App() {
    // The sprite can only be moved in the MainMenu Scene
    // const [canMoveSprite, setCanMoveSprite] = useState(true);
    const [centroControl, setCentroControl] = useState({ btnPlay: false, btnSalir: true })
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();
    const { onToggleMusica, addLetra, reset, ultima } = useGame()


    const changeScene = () => {
        const scene = phaserRef.current.scene

        if (scene) {
            scene.changeScene()
            reset()
        }
    }

    const play = () => {
        const scene = phaserRef.current.scene
        if (scene && scene.scene.key === "MainMenu") {
            scene.stop()
            reset()
            scene.play()
        }
    }

    // Event emitted from the PhaserGame component
    const currentScene = (scene) => {
        if (scene.scene.key === "MainMenu") {
            setCentroControl({ btnPlay: false, btnSalir: true })
        } else if (scene.scene.key === "Game" || scene.scene.key === "GameOver") {
            setCentroControl({ btnPlay: true, btnSalir: false })
        }
    }

    const moveLetra = (scene) => {
        if (scene && scene.scene.key === 'MainMenu') {
            scene.moveLetra(letra => {
                addLetra(letra)
                ultima(letra)
            })
        }
    }

    const onMove = ()=> {
        const scene = phaserRef.current.scene
        moveLetra(scene)
    }

    return (
        <div id="app">
            <div className="centro">
                <LetraList move={onMove} />
                <PhaserGame ref={phaserRef} currentActiveScene={(scene) => {
                    currentScene(scene)
                    moveLetra(scene)
                }} />
            </div>
            <div>
                <div>
                    <button disabled={centroControl.btnPlay} className="button" onClick={play}>Play</button>
                </div>
                <div>
                    <button disabled={centroControl.btnSalir} className="button" onClick={changeScene}>Salir</button>
                </div>
                <div>
                    <button className="button" onClick={() => onToggleMusica()}>Toggle Musíca</button>
                </div>
                <div>
                    <button className="button" onClick={changeScene}>HowTo</button>
                </div>
            </div>
        </div>
    )
}

export default App