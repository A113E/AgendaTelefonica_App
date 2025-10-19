const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

console.log('Conectando a', url)

mongoose.connect(url)
  .then(result => {
    console.log('Conectado a MongoDB')
  })
  .catch(error => {
    console.log('Error al conectar con MongoDB:', error.message)
  })

const personaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  numero: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: v => /^\d{2,3}-\d+$/.test(v),
      message: () => 'El numero de telefono debe de tener al menos 8 digitos y debe estar formado por dos partes separadas por -, la primera parte tiene dos o tres números y la segunda parte también consiste en números'
    }
  }
})

personaSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Persona', personaSchema)
