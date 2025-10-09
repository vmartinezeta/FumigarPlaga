import checkImg from "../images/star.png";

export default function Logros() {
    const logros = JSON.parse(localStorage.getItem('gameAchievements') || "[]");

    return <div className="logros">
        {logros.map(logro => <div className="logro"> <img src={checkImg} /> <h1 className="logro__titulo">{logro.text}</h1></div>)}
    </div>
}
