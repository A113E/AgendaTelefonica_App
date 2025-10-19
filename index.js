require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Persona = require('./models/persona')

const app = express()

const manejoErrores = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'ID Malformateado' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// Middleware que imprime información sobre cada solicitud
const infoSolicitudes = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('---')
  next()
}

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

// Rutas
// Obtener la info de la app
app.get('/info', (request, response) => {
  const fecha = new Date().toString()
  Persona.countDocuments({}).then(cuenta => {
    const html = `
      <h3> La agenda telefonica cuenta con ${cuenta} personas </h3>
      <p> ${fecha} </p>
      `
    response.send(html)
  })
})

// Obtener las personas
app.get('/api/personas', (request, response) => {
  Persona.find({}).then(personas => {
    response.json(personas)
  })
})

// Obtener una persona
app.get('/api/personas/:id', (request, response, next) => {
  const id = Number(request.params.id)
  Persona.findById(id)
    .then(persona => {
      if (persona) {
        response.json(persona)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Eliminar una persona
app.delete('/api/personas/:id', (request, response, next) => {
  const id = Number(request.params.id)
  Persona.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Postear una persona
app.post('/api/personas', (request, response, next) => {
  const { nombre, numero } = request.body

  if (!nombre) {
    return response.status(400).json({ error: 'Nombre es requerido' })
  }

  if (!numero) {
    return response.status(400).json({ error: 'Numero es requerido' })
  }

  const persona = new Persona({
    nombre,
    numero
  })

  persona
    .save()
    .then(personaGuardada => {
      response.json(personaGuardada)
    })
    .catch(error => next(error))
})

// Actualizar una persona
app.put('/api/personas/:id', (request, response, next) => {
  const id = Number(request.params.id)
  const { nombre, numero } = request.body

  // Encuentra la persona a actualizar por el id
  Persona.findById(id)
    .then(persona => {
      if (!persona) {
        response.status(404).end()
      }

      persona.nombre = nombre
      persona.numero = numero

      return persona.save().then(personaActualizada => {
        response.json(personaActualizada)
      })
    })
    .catch(error => next(error))
})

// Middleware para capturar solicitudes a rutas inexistentes
const rutasInexistentes = (request, response) => {
  response.status(400).send({ error: 'Ruta Inexistente' })
}

app.use(infoSolicitudes)
app.use(rutasInexistentes)
app.use(manejoErrores)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})