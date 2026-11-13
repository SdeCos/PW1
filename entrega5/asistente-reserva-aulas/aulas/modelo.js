// El modelo: cómo es un aula
const mongoose = require('mongoose');

const Aula = mongoose.model('Aula', new mongoose.Schema({
  nombre:    { type: String, required: true },
  capacidad: { type: Number, required: true, min: 1 },
  edificio:  { type: String, required: true },
  creadaPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }   // quién la creó
}));

module.exports = Aula;
