const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://admin:${password}@cluster0.lm4im.mongodb.net/agenda_telefonica?retryWrites=true&w=majority&appName=Cluster0 `

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personaSchema = new mongoose.Schema({
  nombre: String,
  numero: String
})

const Persona = mongoose.model('Persona', personaSchema)

const persona = new Persona({
  nombre: 'Noelia',
  numero: '54006463'
})

persona.save().then(result => {
  console.log('Persona guardada!')
  mongoose.connection.close()
})