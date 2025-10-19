import axios from 'axios'

const baseUrl = 'api/personas'

// Servicio para obtener las personas
function obtenerPersonas() {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

// Servicio para crear una persona
function crearPersona(nuevaPersona) {
    const request = axios.post(baseUrl, nuevaPersona)
    return request.then(response => response.data)
}


// Servicio para actualizar una persona
function actualizarPersona(id, personaActualizada) {
    const request = axios.put(`${baseUrl}/${id}`, personaActualizada)
    return request.then(response => response.data)
}

// Servicio para eliminar una persona
function eliminarPersona(id) {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data) 
}

export default {
    obtenerPersonas,
    crearPersona,
    actualizarPersona,
    eliminarPersona
}