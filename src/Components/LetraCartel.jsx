import PropTypes from "prop-types"

export default function LetraCartel({letra}) {
    return <div className="caja" style={{
        left:letra.origen.x-25+45,
        top:letra.origen.y+20
    }}>
        <h1 className="titulo">{letra.caracter}</h1>
    </div>
}

LetraCartel.propTypes = {
    letra: PropTypes.shape({
      origen: PropTypes.object.isRequired,
      caracter: PropTypes.string.isRequired
    }).isRequired,
  };