import { useGame } from "../context/GameContext";

export default function CentroControl({scene, onChangeScene}) {
    const { onToggleMusica, cancelarAnimacion} = useGame();

    const day = () => {
        if (!scene) return;
        cancelarAnimacion();
        scene.cancelAnimation();
        onChangeScene(scene.changeScene("DayScene"));
    }

    const night = () => {
        if (!scene) return;
        cancelarAnimacion();
        scene.cancelAnimation();
        onChangeScene(scene.changeScene("NightScene"));
    }

    const cerrar = () => {
        if (!scene) return;
        scene.changeScene("MainMenu");
    }

    const howTo = () => {
        if (!scene) return;
        if (scene.scene.key === "MainMenu") {
            cancelarAnimacion();
            scene.cancelAnimation()
        }

        onChangeScene(anterior => {
            if (anterior.scene.key === "MainMenu") {
                return scene.changeScene("HowTo");
            }
            return scene.changeScene("MainMenu");
        })
    }

    const logros = () => {
        if (!scene) return;
        if (scene.scene.key === "MainMenu") {
            cancelarAnimacion();
            scene.cancelAnimation();
        }

        onChangeScene(anterior => {
            if (anterior.scene.key === "MainMenu") {
                return scene.changeScene("LogroScene");
            }
            return scene.changeScene("MainMenu");
        });        
    }

    if (!scene) return null;
    const {key} = scene.scene;

    if (key === "DayScene" || key==="NightScene" || key === "GameOver") {
        return <div className="columna__control">
            <button className="button" onClick={cerrar}>Salir</button>
            <button className="button" onClick={() => onToggleMusica()}>Toggle Musíca</button>
        </div>
    } else if (key === "MainMenu") {
        return <div className="columna__control">
            <button disabled={false} className="button" onClick={day}>Dia</button>
            <button disabled={false} className="button" onClick={night} >Noche</button>
            <button className="button" onClick={logros}>Logros</button>
            <button className="button" onClick={howTo}>HowTo</button>
            <button className="button" onClick={() => onToggleMusica()}>Toggle Musíca</button>
        </div>
    } else if (key === "HowTo") {
        return <div className="columna__control">
            <button className="button" onClick={howTo}>HowTo</button>
            <button className="button" onClick={() => onToggleMusica()}>Toggle Musíca</button>
        </div>
    } else if (key === "LogroScene") {
        return <div className="columna__control">
            <button className="button" onClick={logros}>Logros</button>
            <button className="button" onClick={() => onToggleMusica()}>Toggle Musíca</button>
        </div>
    }
}