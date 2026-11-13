// Reserva de aulas · sesión 17 · punto de partida (el CRUD de usuarios de la sesión 16)
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());              // lee el JSON que llega en el cuerpo (req.body)
app.use(express.static('publico'));   // sirve las páginas de la carpeta publico

// El modelo: cómo es un usuario
const Usuario = mongoose.model('Usuario', new mongoose.Schema({
  nombre: { type: String, required: true },
  email:  { type: String, required: true }
}));

// CREAR
app.post('/api/usuarios', async (req, res) => {
  const usuario = await Usuario.create(req.body);
  res.status(201).json(usuario);
});

// LEER todos
app.get('/api/usuarios', async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
});

// LEER uno
app.get('/api/usuarios/:id', async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);
  if (!usuario) return res.status(404).json({ error: 'Ese usuario no existe' });
  res.json(usuario);
});

// ACTUALIZAR
app.put('/api/usuarios/:id', async (req, res) => {
  const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body,
    { returnDocument: 'after', runValidators: true });
  if (!usuario) return res.status(404).json({ error: 'Ese usuario no existe' });
  res.json(usuario);
});

// BORRAR
app.delete('/api/usuarios/:id', async (req, res) => {
  const usuario = await Usuario.findByIdAndDelete(req.params.id);
  if (!usuario) return res.status(404).json({ error: 'Ese usuario no existe' });
  res.status(204).end();
});

// ↑ Las rutas, siempre encima de esta línea ↑

// Si algo falla (falta un campo, un id que no es válido…), respondemos 400
app.use((err, req, res, next) => {
  res.status(400).json({ error: err.message });
});

// Primero conectamos con MongoDB; después, el servidor empieza a escuchar
mongoose.connect('mongodb://127.0.0.1:27017/reserva-aulas')
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(3000, () => {
      console.log('Servidor en http://localhost:3000');
    });
  })
  .catch(err => {
    console.log('No puedo conectar con MongoDB. ¿Está arrancado?', err.message);
  });
