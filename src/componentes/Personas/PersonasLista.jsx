import Persona from './Persona'

// Componente que almacena las personas
function PersonasLista({ personas, handleEliminarPersona }) {
  // Verifica si no hay personas
  if (personas.length === 0) {
    return <div>No hay resultados...</div>
  }
  return (
    <div>
      <h2> Personas </h2>
      <ul>
          {personas.map((persona) => (
            <Persona
            key={persona.id}
            persona={persona}
            handleEliminarPersona={handleEliminarPersona}
            />
          ))}
        </ul>
    </div>
  )
}

export default PersonasLista