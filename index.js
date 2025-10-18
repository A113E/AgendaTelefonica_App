const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

// Middleware que imprime información sobre cada solicitud
const infoSolicitudes = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('---')
  next()
}

app.use(infoSolicitudes)


let personas = [
    {
      id: "1",
      nombre: "Arto Hellas",
      numero: "040-123456"
    },
    {
      id: "2",
      nombre: "Ada Lovelace",
      numero: "39-44-5323523"
    },
    {
      id: "3",
      nombre: "Dan Abramov",
      numero: "12-43-234345"
    },
    {
      id: "4",
      nombre: "Mary Poppendieck",
      numero: "39-23-6423122"
    },
    {
      id: "3566",
      nombre: "Alberto Martir",
      numero: "98-04-025"
    }
]

// Rutas
// Obtener la info de la app
app.get('/info', (request, response) => {
    const fecha = new Date().toString()
    const html = `
    <p> La agenda telefónica cuenta con ${personas.length} registros </p>
    <p> ${fecha} </p>
    `
    response.send(html)
})

// Obtener las personas
app.get('/api/personas', (request, response) => {
    response.json(personas)
})

// Obtener una persona
app.get('/api/personas/:id', (request, response) => {
    const id = request.params.id
    const persona = personas.find(persona => persona.id === id)

    if (persona) {
        response.json(persona)
    } else {
        response.status(400).end()
    }
})

// Eliminar una persona
app.delete('/api/personas/:id', (request, response) => {
  const id = request.params.id
  personas = personas.filter(p => p.id !== id)

  response.status(204).end()
})

// Postear una persona
app.post('/api/personas', (request, response) => {
  const { nombre, numero } = request.body

  if (!nombre) {
    return response.status(400).json({ error: 'Nombre es requerido' })
  }

  if (!numero) {
    return response.status(400).json({ error: 'Numero es requerido' })
  }

  const persona = {
    nombre, 
    numero
  }

  personas = personas.concat(persona)

  response.json(persona)
})

// Middleware para capturar solicitudes a rutas inexistentes
const rutasInexistentes = (request, response) => {
  response.status(400).send({ error: 'Ruta Inexistente' })
}

app.use(rutasInexistentes)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})