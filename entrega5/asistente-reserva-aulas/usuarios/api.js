// La API de usuarios: /api/usuarios, /api/registro y /api/login. Responde JSON
const express = require('express');
const Usuario = require('./modelo');
const { hashDeClave, entrar, requiereLogin } = require('./sesion');   // Paso 6 · el portero, también aquí

const router = express.Router();

// CREAR
router.post('/api/usuarios', async (req, res) => {
  const usuario = await Usuario.create(req.body);
  res.status(201).json(usuario);
});

// LEER todos
router.get('/api/usuarios', async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
});

// LEER uno
router.get('/api/usuarios/:id', async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);
  if (!usuario) return res.status(404).json({ error: 'Ese usuario no existe' });
  res.json(usuario);
});

// ACTUALIZAR (Paso 6 · solo tú, y solo tu nombre y tu email)
router.put('/api/usuarios/:id', requiereLogin, async (req, res) => {
  if (req.params.id !== req.usuario.sub) {
    return res.status(403).json({ error: 'Solo puedes cambiar tu propio usuario' });
  }
  const { nombre, email } = req.body;   // del cuerpo cogemos solo lo que se puede cambiar: la clave, no
  const usuario = await Usuario.findByIdAndUpdate(req.params.id, { nombre, email },
    { returnDocument: 'after', runValidators: true });
  if (!usuario) return res.status(404).json({ error: 'Ese usuario no existe' });
  res.json(usuario);
});

// BORRAR (Paso 6 · solo tú)
router.delete('/api/usuarios/:id', requiereLogin, async (req, res) => {
  if (req.params.id !== req.usuario.sub) {
    return res.status(403).json({ error: 'Solo puedes borrar tu propio usuario' });
  }
  const usuario = await Usuario.findByIdAndDelete(req.params.id);
  if (!usuario) return res.status(404).json({ error: 'Ese usuario no existe' });
  res.status(204).end();
});

// ===== Darse de alta con una clave (sesión 18) =====

// REGISTRO
router.post('/api/registro', async (req, res) => {
  const { nombre, email, clave } = req.body;
  if (!nombre || !email || !clave) {
    return res.status(400).json({ error: 'Faltan el nombre, el email o la clave' });
  }
  if (await Usuario.findOne({ email })) {
    return res.status(409).json({ error: 'Ese email ya está registrado' });
  }
  const usuario = await Usuario.create({ nombre, email, clave: hashDeClave(clave) });
  // create devuelve el documento entero, clave incluida: respondemos solo lo que se puede ver
  res.status(201).json({ _id: usuario._id, nombre: usuario.nombre, email: usuario.email });
});

// ===== Entrar: email y clave a cambio de un token (sesión 18) =====

// LOGIN
router.post('/api/login', async (req, res) => {
  const token = await entrar(req.body.email, req.body.clave);
  if (!token) return res.status(401).json({ error: 'Email o clave incorrectos' });
  res.json({ token });
});

module.exports = router;
