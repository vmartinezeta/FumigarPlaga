// eslint-disable-next-line react/prop-types
export default function Letra({letra}) {
    if (!letra) return null
    return <div className="caja" style={{
        left:letra.origen.x-25,
        top:letra.origen.y+20
    }}>
        <h1 className="titulo">{letra.caracter}</h1>
    </div>
}