
export default function LetraCartel({letra}) {
    return <div className="rotulo-ppal__letra" style={{
        left:letra.origen.x+30,
        top:letra.origen.y+60,
    }}>
        <h1 className="rotulo-ppal__simbolo">{letra.caracter}</h1>
    </div>
}