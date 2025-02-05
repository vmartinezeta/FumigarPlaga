import { useGame } from "../context/GameContext"
import LetraCartel from "./LetraCartel"

export default function LetraList() {
    const {letras} = useGame()
    return <div className="letras">
        {
            letras.map((l, idx)=> {
                return <LetraCartel key={idx} letra={l} />
            })
        }
    </div>
}