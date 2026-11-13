// La página de reservas: /reservas. Responde HTML, pintado en el servidor
const express = require('express');
const Reserva = require('./modelo');
const Aula = require('../aulas/modelo');
const { leerToken, requiereLogin } = require('../usuarios/sesion');
const { parsearFecha } = require('./fechas');
const { paginaReservas } = require('./vistas');

const router = express.Router();

router.get('/reservas', async (req, res) => {
  const [aulas, reservas] = await Promise.all([
    Aula.find().sort({ nombre: 1 }),
    Reserva.find().populate('aula', 'nombre edificio').populate('usuario', 'nombre').sort({ fecha: 1, hora: 1 })
  ]);
  const errores = {
    ocupada: 'Esa aula ya está reservada para ese día y esa hora.',
    fecha: 'El día y la hora indicados no son válidos.'
  };
  res.send(paginaReservas(aulas, reservas, leerToken(req), errores[req.query.error] || ''));
});

router.post('/reservas', requiereLogin, async (req, res) => {
  const { aula, fecha, hora } = req.body;
  const fechaReserva = parsearFecha(fecha);
  if (!fechaReserva || typeof hora !== 'string' || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
    return res.redirect('/reservas?error=fecha');
  }
  if (!await Aula.exists({ _id: aula })) return res.status(404).send('Esa aula no existe');
  try {
    await Reserva.create({ aula, fecha: fechaReserva, hora, usuario: req.usuario.sub });
  } catch (err) {
    if (err.code === 11000) return res.redirect('/reservas?error=ocupada');
    throw err;
  }
  res.redirect('/reservas');
});

router.post('/reservas/:id/anular', requiereLogin, async (req, res) => {
  const reserva = await Reserva.findById(req.params.id);
  if (!reserva) return res.status(404).send('Esa reserva no existe');
  if (String(reserva.usuario) !== req.usuario.sub) return res.status(403).send('Solo puedes anular tus propias reservas');
  await reserva.deleteOne();
  res.redirect('/reservas');
});

module.exports = router;
