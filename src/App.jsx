import { useRef, useState } from 'react';
import { PhaserGame } from './game/PhaserGame';
import { useGame } from './context/GameContext';

function App() {
    // The sprite can only be moved in the MainMenu Scene
    // const [canMoveSprite, setCanMoveSprite] = useState(true);
    const [centroControl, setCentroControl] = useState({btnPlay:false, btnSalir:true})
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();
    const {onToggleMusica} = useGame()

    // const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

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

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
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