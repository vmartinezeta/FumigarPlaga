import { useRef, useState } from 'react'
import { PhaserGame } from './game/PhaserGame'
import { useGame } from './context/GameContext'
import Letra from './Components/Letra';
import "./estilos.css"

function App() {
    // The sprite can only be moved in the MainMenu Scene
    // const [canMoveSprite, setCanMoveSprite] = useState(true);
    const [centroControl, setCentroControl] = useState({btnPlay:false, btnSalir:true})
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();
    const {onToggleMusica} = useGame()
    const [letra, setLetra] = useState(null)

    const changeScene = () => {

        const scene = phaserRef.current.scene;

        if (scene) {
            scene.changeScene()
        }
    }

    // Event emitted from the PhaserGame component
    const currentScene = (scene) => {
        if (scene.scene.key === "MainMenu") {
            setCentroControl({btnPlay:false, btnSalir:true})
        } else if (scene.scene.key === "Game" || scene.scene.key === "GameOver") {
            setCentroControl({btnPlay:true, btnSalir:false})
        }
    }

    const moveLetra = (scene) => {
            if (scene && scene.scene.key === 'MainMenu')
                {
                // Get the update logo position
                scene.moveLetra(obj => {
                    setLetra(obj)
                })
            }
    }

    return (
        <div id="app">
            <div className="centro">
                <Letra letra={letra} />
                <PhaserGame ref={phaserRef} currentActiveScene={(scene)=>{
                    currentScene(scene)
                    moveLetra(scene)
                }} />
            </div>
            <div>
                <div>
                    <button disabled={centroControl.btnPlay} className="button" onClick={changeScene}>Play</button>
                </div>
                <div>
                    <button disabled={centroControl.btnSalir} className="button" onClick={changeScene}>Salir</button>
                </div>
                <div>
                    <button className="button" onClick={()=>onToggleMusica()}>Toggle Musíca</button>
                </div>
            </div>
        </div>
    )
}

export default App