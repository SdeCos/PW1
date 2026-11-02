// Un CRUD de usuarios con Express y MongoDB (pasos 1 y 2)
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());              // Paso 2 · lee el JSON que llega en el cuerpo (req.body)

// Paso 2 · El modelo: cómo es un usuario
const Usuario = mongoose.model('Usuario', new mongoose.Schema({
  nombre: { type: String, required: true },
  email:  { type: String, required: true }
}));

// Paso 1 · La página de inicio, de momento solo un texto
app.get('/', (req, res) => {
  res.send('¡Hola! El servidor funciona.');
});

// CREAR (paso 2)
app.post('/api/usuarios', async (req, res) => {
  const usuario = await Usuario.create(req.body);
  res.status(201).json(usuario);
});

// ↑ Las rutas, siempre encima de esta línea ↑

// Paso 2 · Si algo falla (falta un campo, un id que no es válido…), respondemos 400
app.use((err, req, res, next) => {
  res.status(400).json({ error: err.message });
});

// Paso 2 · Primero conectamos con MongoDB; después, el servidor empieza a escuchar
mongoose.connect('mongodb://127.0.0.1:27017/usuarios-crud')
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(3000, () => {
      console.log('Servidor en http://localhost:3000');
    });
  })
  .catch(err => {
    console.log('No puedo conectar con MongoDB. ¿Está arrancado?', err.message);
  });
