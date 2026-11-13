// El modelo: cómo es un usuario
const mongoose = require('mongoose');

const Usuario = mongoose.model('Usuario', new mongoose.Schema({
  nombre: { type: String, required: true },
  email:  { type: String, required: true },
  clave:  { type: String, select: false }   // el hash de la clave; select: false: no sale al buscar
}));

module.exports = Usuario;
