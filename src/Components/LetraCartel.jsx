
export default function LetraCartel({letra}) {
    return <div className="rotulo-ppal__letra" style={{
        left:letra.origen.x-25+45,
        top:letra.origen.y+20
    }}>
        <h1 className="rotulo-ppal__simbolo">{letra.caracter}</h1>
    </div>
}