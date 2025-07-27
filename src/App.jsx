import { useRef, useState } from 'react'
import { PhaserGame } from './game/PhaserGame'
import { useGame } from './context/GameContext'
import "./estilos.css"
import LetraList from './Components/LetraList';

function App() {
    const [centroControl, setCentroControl] = useState({ btnPlay: false, btnSalir: true })
    const { onToggleMusica, addLetra, reset, ultima } = useGame()
    const [scene, setScene] = useState(null);
    const phaserRef = useRef();


    const play = () => {
        if (!scene) return;
        reset();
        scene.cancelAnimation();
        scene.changeScene("Game");
    }

    const cerrar = () =>{
        if (!scene) return;
        scene.changeScene("MainMenu");
    }

    const howTo = () => {
        if (!scene) return;
        reset();
        setScene(anterior => {
            if (anterior.scene.key === "MainMenu") {
                return scene.changeScene("HowTo");
            }
            return scene.changeScene("MainMenu");
        })
    }


    const currentScene = (scene) => {
        setScene(scene);
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
                    currentScene(scene);
                    moveLetra(scene);
                }} />
            </div>
            <div>
                <div>
                    <button disabled={centroControl.btnPlay} className="button" onClick={play}>Play</button>
                </div>
                <div>
                    <button disabled={centroControl.btnSalir} className="button" onClick={cerrar}>Salir</button>
                </div>
                <div>
                    <button className="button" onClick={() => onToggleMusica()}>Toggle Musíca</button>
                </div>
                <div>
                    <button className="button" onClick={howTo}>HowTo</button>
                </div>
            </div>
        </div>
    )
}

export default App