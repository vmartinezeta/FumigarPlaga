import { useEffect, useRef, useState } from 'react';
import { PhaserGame } from './game/PhaserGame';
import { useGame } from './context/GameContext';
import LetraList from './Components/LetraList';
import CentroControl from './Components/CentroControl';
import "./estilos.css";
import Logros from './Components/Logros';


function App() {
    const { addLetra,letras, cancelarAnimacion } = useGame();
    const [scene, setScene] = useState(null);
    const [index, setIndex] = useState(0);
    const phaserRef = useRef();
    const time = useRef(1000);

    useEffect(()=> {
        const letra = letras[letras.length-1];
        if (!scene) return;
        if ((letra && !letra.ultima) || (scene && scene.scene.key !== "MainMenu")) return;
        const interval = setInterval(() => {
            if (index === 0) {
                setIndex(index + 1);
            } else if (index === 1) {
                cancelarAnimacion();
                setIndex(index + 1);
                time.current = 100;
            } else if (index === 2) {
                scene.reiniciar();            
                setIndex(0);
                time.current = 1000;
            }
        }, time.current);

        return () => {
            clearInterval(interval);
        }
    },[letras, index]);

    const currentScene = (scene) => {
        setScene(scene);
    }

    const moverLetra = (scene) => {
        if (!scene || scene.scene.key !== "MainMenu") return;
        scene.moverLetra(letra => {
            addLetra(letra);
        });
    }

    const onMover = () => moverLetra(scene)

    return <div className="columna">
        <div className="columna__par">
            <div className="columna__izq">
                <div className="columna__render">
                    {scene&&scene.scene.key === "MainMenu"&&<LetraList onMover={onMover} />}
                    {/* {scene&&scene.scene.key === "LogroScene"&&<Logros /> } */}
                    <PhaserGame ref={phaserRef} currentActiveScene={(scene) => {
                        currentScene(scene);
                        moverLetra(scene);
                    }} />
                </div>
            </div>
            <div className="columna__der">
                <CentroControl scene={scene} onChangeScene={setScene} />
            </div>
        </div>
    </div>
}

export default App;