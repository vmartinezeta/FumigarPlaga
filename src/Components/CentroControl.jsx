import { useGame } from "../context/GameContext";

export default function CentroControl({scene, onChangeScene}) {
    const { onToggleMusica, cancelarAnimacion} = useGame()

    const play = () => {
        if (!scene) return;
        cancelarAnimacion();
        scene.cancelAnimation();
        onChangeScene(scene.changeScene("Game"));
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


    if (scene && (scene.scene.key === "Game" || scene.scene.key === "GameOver")) {
        return <div className="columna__control">
            <button className="button" onClick={cerrar}>Salir</button>
            <button className="button" onClick={() => onToggleMusica()}>Toggle Musíca</button>
        </div>
    } else if (scene && scene.scene.key === "MainMenu") {
        return <div className="columna__control">
            <button disabled={false} className="button" onClick={play}>Play</button>
            <button className="button" onClick={() => onToggleMusica()}>Toggle Musíca</button>
            <button className="button" onClick={howTo}>HowTo</button>
        </div>
    } else if (scene && scene.scene.key === "HowTo") {
        return <div className="columna__control">
            <button className="button" onClick={() => onToggleMusica()}>Toggle Musíca</button>
            <button className="button" onClick={howTo}>HowTo</button>
        </div>
    }

    return null;
}