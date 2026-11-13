// La API de aulas: /api/aulas. Responde JSON
const express = require('express');
const Aula = require('./modelo');
const { requiereLogin } = require('../usuarios/sesion');

const router = express.Router();

// CREAR (con requiereLogin delante: sin token, 401)
router.post('/api/aulas', requiereLogin, async (req, res) => {
  const aula = await Aula.create({ ...req.body, creadaPor: req.usuario.sub });
  res.status(201).json(aula);
});

// LEER todas
router.get('/api/aulas', async (req, res) => {
  const aulas = await Aula.find();
  res.json(aulas);
});

// LEER una
router.get('/api/aulas/:id', async (req, res) => {
  const aula = await Aula.findById(req.params.id);
  if (!aula) return res.status(404).json({ error: 'Esa aula no existe' });
  res.json(aula);
});

// ACTUALIZAR
router.put('/api/aulas/:id', requiereLogin, async (req, res) => {
  const aula = await Aula.findByIdAndUpdate(req.params.id, req.body,
    { returnDocument: 'after', runValidators: true });
  if (!aula) return res.status(404).json({ error: 'Esa aula no existe' });
  res.json(aula);
});

// BORRAR
router.delete('/api/aulas/:id', requiereLogin, async (req, res) => {
  const aula = await Aula.findById(req.params.id);
  if (!aula) return res.status(404).json({ error: 'Esa aula no existe' });
  // sé quién eres, pero esta aula no es tuya: 403
  if (String(aula.creadaPor) !== req.usuario.sub) {
    return res.status(403).json({ error: 'Solo quien creó el aula puede borrarla' });
  }
  await aula.deleteOne();
  res.status(204).end();
});

module.exports = router;
