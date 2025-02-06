import { useEffect } from "react"
import { useGame } from "../context/GameContext"
import LetraCartel from "./LetraCartel"

// eslint-disable-next-line react/prop-types
export default function LetraList({move}) {    
    const {tiempo, letras, reset, index, resetIndex, next, letra} = useGame()

    useEffect(()=>{
        if(!(letra && letra.isUltima())) return

        const interval = setInterval(() => {
            next()
            if(index === 1){
                reset()
                tiempo.current = 100
            } else if (index === 2) {
                move()                
                resetIndex()
                tiempo.current = 1000
            }
        }, tiempo.current)

        return () => {
            clearInterval(interval)
        }
    },[index, letra, reset, move, next, resetIndex, tiempo])

    return <div className="letras">
        {
            letras.map((l, idx)=> {
                return <LetraCartel key={idx} letra={l} />
            })
        }
    </div>
}