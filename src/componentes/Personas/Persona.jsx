function Persona({ persona, handleEliminarPersona }) {
    return (
        <div>
            {persona.nombre} - {persona.numero}  <button onClick={() => handleEliminarPersona(persona.id)}>Eliminar</button>
        </div>
    )
}

export default Persona