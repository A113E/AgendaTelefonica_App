import { useState, useEffect } from 'react'
import personasServicio from './servicios/personas'

// Componentes 
import PersonaForm from './componentes/Personas/PersonaForm'
import PersonasLista from './componentes/Personas/PersonasLista'
import Filtrar from './componentes/Otros/Filtrar'
import Notificacion from './componentes/Otros/Notificacion'

function App() {
  const [personas, setPersonas] = useState([])
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [nuevoNumero, setNuevoNumero] = useState('')
  const [buscar, setBuscar] = useState('')
  const [notificacion, setNotificacion] = useState({ mensaje: '', tipo: '' })

  // Hook para cargar las personas desde el servidor
  useEffect(() => {
    console.log('effect')
    personasServicio
    .obtenerPersonas()
    .then(personasInciales => {
      console.log('Promesa cumplida')
      setPersonas(personasInciales)
    })
  }, []) // Evita multiples recargas
  console.log('render', personas.length, 'personas')

  // Funcion para buscar nombres de personas
  const personasMostrar = (buscar
  ? personas.filter((persona) => persona.nombre.toLowerCase().includes(buscar.toLowerCase()))
  : personas
  ).slice() // Copia el array original para no mutarlo
  .sort((a,b) => a.nombre.localeCompare(b.nombre)) // Ordena por orden alfabetico

  // Función para manejar las notificaciones
  function mostrarNotificacion(mensaje, tipo) {
    setNotificacion({ mensaje, tipo })
    setTimeout(() => {
      setNotificacion({ mensaje: '', tipo: '' })
    }, 5000) // 5 segundos en pantalla
  }

  // Función que maneja la eliminación de una persona
    function handleEliminarPersona(id) {
        // Buscar la persona
        const personaEliminar = personas.find(persona => persona.id === id)

        if (!personaEliminar) {
            return
        }

        if (personaEliminar) {
            const confirmar = window.confirm(`¿Está seguro que desea eliminar este registro?`)
            if(confirmar) {
                personasServicio
                .eliminarPersona(id)
                .then(() => {
                    setPersonas(personas.filter(p=> p.id !== id))
                })
                mostrarNotificacion('Registro eliminado correctamente', 'exito')
            }
        }
    }
  // Manejador de añadir un nuevo nombre
  function handleNuevaPersona(e) {
    e.preventDefault()
    console.log('click en el boton', e.target)

    // Verificar si la persona ya existe
    const nombreExiste = personas.find((p) => p.nombre.toLowerCase() === nuevoNombre.toLowerCase())
    const numeroExiste = personas.find((p) => p.numero === nuevoNumero)

    // Comprueba si existe tanto el nombre como el numero
    if (nombreExiste && numeroExiste) {
      setNuevoNombre('')
      setNuevoNumero('')
      window.alert('Ya existe una persona registrada con ese nombre y número')
      return 
    }

    // Comprueba si existe el nombre
    if (nombreExiste && !numeroExiste) {
      const confirmar = window.confirm(`La persona "${nuevoNombre} ya se encuentra registrada. ¿Desea reemplazarlo?`)

      if (confirmar) {
        const personaActualizada = { ...nombreExiste, numero: nuevoNumero }
        personasServicio
        .actualizarPersona(nombreExiste.id, personaActualizada)
        .then(personaDevuelta => {
          setPersonas(personas.map(p => p.id !== nombreExiste.id ? p : personaDevuelta))
          mostrarNotificacion(`Número de ${nuevoNombre} actualizado correctamente`, 'exito')
        })
        setNuevoNombre('')
        setNuevoNumero('')
        return
      }
    }

    // Comprueba si existe el numero
    if (!nombreExiste && numeroExiste) {
      const confirmar = window.confirm(`El número ${nuevoNumero} ya se encuentra registrado. ¿Desea reemplazarlo?`)

      if (confirmar) {
        const personaActualizada = { ...numeroExiste, nombre: nuevoNombre }
        personasServicio
        .actualizarPersona(numeroExiste.id, personaActualizada)
        .then(personaDevuelta => {
          setPersonas(personas.map(p => p.id !== numeroExiste.id ? p : personaDevuelta))
          mostrarNotificacion(`Nombre con número ${nuevoNumero} actualizado correctamente`, 'exito')
        })
        setNuevoNombre('')
        setNuevoNumero('')
        return
      }
    }

    // Objeto de persona
    const nuevaPersona = {
      nombre: nuevoNombre, 
      numero: nuevoNumero
    }
    
    personasServicio
    .crearPersona(nuevaPersona)
    .then(personaDevuelta => {
      setPersonas(personas.concat(personaDevuelta))
      console.log(personaDevuelta)
    })
    setNuevoNombre('')
    setNuevoNumero('')
    mostrarNotificacion(`Persona: ${nuevoNombre} con número ${nuevoNumero} registrada correctamente`, 'exito')
  }

  return (
    <div>
      <h1> Agenda Telefonica </h1>
      <Notificacion mensaje={notificacion.mensaje} tipo={notificacion.tipo} />
      <Filtrar buscar={buscar} setBuscar={setBuscar} />
      <PersonasLista personas={personasMostrar} handleEliminarPersona={handleEliminarPersona}/>
      <PersonaForm  
      nuevoNombre={nuevoNombre} 
      setNuevoNombre={setNuevoNombre} 
      handleNuevaPersona={handleNuevaPersona} 
      nuevoNumero={nuevoNumero} 
      setNuevoNumero={setNuevoNumero}
      />
    </div>
  )
}

export default App
