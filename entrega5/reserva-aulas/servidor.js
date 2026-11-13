// Reserva de aulas · práctica 5: la aplicación tal como queda al final de la sesión 19 (paso 6)
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());              // lee el JSON que llega en el cuerpo (req.body)
app.use(express.urlencoded());        // lee lo que envía un <form> sin JavaScript
app.use(express.static('publico'));   // sirve las páginas de la carpeta publico
app.use(cookieParser());              // lee las cookies que manda el navegador (req.cookies)

// Cada recurso, en su carpeta. api.js responde JSON; paginas.js responde HTML
app.use(require('./usuarios/api'));       // /api/usuarios, /api/registro, /api/login
app.use(require('./usuarios/paginas'));   // /entrar, /salir
app.use(require('./aulas/api'));          // /api/aulas
app.use(require('./aulas/paginas'));      // /aulas
app.use(require('./reservas/api'));       // /api/reservas
app.use(require('./reservas/paginas'));   // /reservas

// ↑ Los recursos, siempre encima de esta línea ↑

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
