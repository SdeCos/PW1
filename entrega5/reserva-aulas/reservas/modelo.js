// El modelo: una reserva ocupa un aula durante un día y una hora
const mongoose = require('mongoose');

const esquemaReserva = new mongoose.Schema({
  aula:   { type: mongoose.Schema.Types.ObjectId, ref: 'Aula', required: true },
  usuario:{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  fecha:  { type: Date, required: true },
  hora:   { type: String, required: true, match: /^(?:[01]\d|2[0-3]):[0-5]\d$/ }
}, { timestamps: true });

// MongoDB impide que dos peticiones reserven el mismo espacio a la vez.
esquemaReserva.index({ aula: 1, fecha: 1, hora: 1 }, { unique: true });

const Reserva = mongoose.model('Reserva', esquemaReserva);

module.exports = Reserva;
