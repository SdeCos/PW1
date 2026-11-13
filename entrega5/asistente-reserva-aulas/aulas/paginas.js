// La página de aulas: /aulas. Responde HTML, pintado en el servidor
const express = require('express');
const Aula = require('./modelo');
const { paginaAulas } = require('./vistas');
const { leerToken, requiereLogin } = require('../usuarios/sesion');

const router = express.Router();

// GET /aulas: busca las aulas y responde con la página ya pintada
router.get('/aulas', async (req, res) => {
  const aulas = await Aula.find();
  res.send(paginaAulas(aulas, leerToken(req)));   // y quién ha entrado (o null)
});

// CREAR desde el formulario de la página (sin JavaScript)
router.post('/aulas', requiereLogin, async (req, res) => {
  await Aula.create({ ...req.body, creadaPor: req.usuario.sub });
  res.redirect('/aulas');      // vuelve a la lista, que el servidor pinta de nuevo
});

module.exports = router;
