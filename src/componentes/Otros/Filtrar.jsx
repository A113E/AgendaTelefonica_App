// Componente para Filtrar una busqueda
function Filtrar( { buscar, setBuscar } ) {
  return (
    <div>
      Buscar persona:
      <input value={buscar} onChange={(e) => setBuscar(e.target.value)} />
    </div>
  )
}

export default Filtrar