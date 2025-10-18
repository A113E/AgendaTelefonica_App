// Componente para agregar una persona
function PersonaForm({ handleNuevaPersona, nuevoNombre, nuevoNumero, setNuevoNombre, setNuevoNumero }) {
  // Manejador de cambio de valor en el input
  function handleCambioNombre(e) {
    console.log(e.target.value)
    setNuevoNombre(e.target.value)
  }
  function handleCambioNumero(e) {
    setNuevoNumero(e.target.value)
  }

  return (
    <div>
      <h2> Añadir Persona </h2>
      <form onSubmit={handleNuevaPersona}>
        <div>
          Nombre:
          <input type='text' name='nombre' value={nuevoNombre} onChange={handleCambioNombre} />
        </div>
        <div>
          Numero:
          <input type='text' name='numero' value={nuevoNumero} onChange={handleCambioNumero} />
        </div>
        <button type='submit'> Añadir </button>
      </form>
    </div>
  )
}

export default PersonaForm