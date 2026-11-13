// La API de reservas: /api/reservas. Responde JSON
const express = require('express');
const Reserva = require('./modelo');
const Aula = require('../aulas/modelo');
const { requiereLogin } = require('../usuarios/sesion');
const { parsearFecha } = require('./fechas');

const router = express.Router();

// LEER todas, con el nombre del aula y de quien la reservó
router.get('/api/reservas', async (req, res) => {
  const reservas = await Reserva.find()
    .populate('aula', 'nombre edificio')
    .populate('usuario', 'nombre')
    .sort({ fecha: 1, hora: 1 });
  res.json(reservas);
});

// CREAR: solo una persona que haya entrado puede reservar
router.post('/api/reservas', requiereLogin, async (req, res) => {
  const { aula, fecha, hora } = req.body;
  const fechaReserva = parsearFecha(fecha);
  if (!aula || !fechaReserva || typeof hora !== 'string' || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
    return res.status(400).json({ error: 'Indica un aula, un día válido y una hora entre 00:00 y 23:59' });
  }
  const existeAula = await Aula.exists({ _id: aula });
  if (!existeAula) return res.status(404).json({ error: 'Esa aula no existe' });

  try {
    const reserva = await Reserva.create({ aula, fecha: fechaReserva, hora, usuario: req.usuario.sub });
    await reserva.populate([{ path: 'aula', select: 'nombre edificio' }, { path: 'usuario', select: 'nombre' }]);
    res.status(201).json(reserva);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Esa aula ya está reservada para ese día y esa hora' });
    throw err;
  }
});

// ANULAR: solo quien hizo la reserva puede borrarla
router.delete('/api/reservas/:id', requiereLogin, async (req, res) => {
  const reserva = await Reserva.findById(req.params.id);
  if (!reserva) return res.status(404).json({ error: 'Esa reserva no existe' });
  if (String(reserva.usuario) !== req.usuario.sub) {
    return res.status(403).json({ error: 'Solo puedes anular tus propias reservas' });
  }
  await reserva.deleteOne();
  res.status(204).end();
});

module.exports = router;
