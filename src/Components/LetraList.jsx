import { useEffect } from "react"
import { useGame } from "../context/GameContext"
import LetraCartel from "./LetraCartel"


export default function LetraList({ onMover }) {
    const { letras, next} = useGame()

    useEffect(() => {

        const interval = setInterval(() => {
            next();
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, [onMover, next]);

    return <div className="rotulo-ppal">
        {
            letras.map((l, idx) => (<LetraCartel key={idx} letra={l} />))
        }
    </div>
}