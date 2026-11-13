// Reserva de aulas · sesión 17 · paso 4: un formulario sin JavaScript
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());              // lee el JSON que llega en el cuerpo (req.body)
app.use(express.urlencoded());        // Paso 4 · lee lo que envía un <form> sin JavaScript
app.use(express.static('publico'));   // sirve las páginas de la carpeta publico

// El modelo: cómo es un usuario
const Usuario = mongoose.model('Usuario', new mongoose.Schema({
  nombre: { type: String, required: true },
  email:  { type: String, required: true }
}));

// Paso 1 · El modelo: cómo es un aula
const Aula = mongoose.model('Aula', new mongoose.Schema({
  nombre:    { type: String, required: true },
  capacidad: { type: Number, required: true, min: 1 },
  edificio:  { type: String, required: true }
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

// ===== Paso 1 · La API de aulas: las mismas cinco rutas, cambiando Usuario por Aula =====

// CREAR
app.post('/api/aulas', async (req, res) => {
  const aula = await Aula.create(req.body);
  res.status(201).json(aula);
});

// LEER todas
app.get('/api/aulas', async (req, res) => {
  const aulas = await Aula.find();
  res.json(aulas);
});

// LEER una
app.get('/api/aulas/:id', async (req, res) => {
  const aula = await Aula.findById(req.params.id);
  if (!aula) return res.status(404).json({ error: 'Esa aula no existe' });
  res.json(aula);
});

// ACTUALIZAR
app.put('/api/aulas/:id', async (req, res) => {
  const aula = await Aula.findByIdAndUpdate(req.params.id, req.body,
    { returnDocument: 'after', runValidators: true });
  if (!aula) return res.status(404).json({ error: 'Esa aula no existe' });
  res.json(aula);
});

// BORRAR
app.delete('/api/aulas/:id', async (req, res) => {
  const aula = await Aula.findByIdAndDelete(req.params.id);
  if (!aula) return res.status(404).json({ error: 'Esa aula no existe' });
  res.status(204).end();
});

// ===== Paso 2 · La página de aulas la pinta el SERVIDOR (SSR) =====

// Paso 3 · Cambia los caracteres especiales de HTML por su versión escrita.
// El & va el primero: si fuera el último, estropearía los &lt; que acabamos de poner.
function escaparHTML(texto) {
  return String(texto)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// Una fila de la tabla, como texto HTML (con cada dato escapado)
function filaAula(aula) {
  return `<tr><td>${escaparHTML(aula.nombre)}</td><td>${escaparHTML(aula.capacidad)}</td><td>${escaparHTML(aula.edificio)}</td></tr>`;
}

// La página entera, como texto HTML, con las filas ya dentro
function paginaAulas(aulas) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Aulas</title>
  <link rel="stylesheet" href="/estilo.css">
</head>
<body>
  <nav><a href="/">Usuarios</a> · <b>Aulas</b></nav>
  <h1>Aulas</h1>
  <form method="post" action="/aulas">
    <input name="nombre" placeholder="Nombre" required>
    <input name="capacidad" type="number" min="1" placeholder="Capacidad" required>
    <input name="edificio" placeholder="Edificio" required>
    <button>Crear</button>
  </form>
  <table>
    <thead>
      <tr><th>Nombre</th><th>Capacidad</th><th>Edificio</th></tr>
    </thead>
    <tbody id="tabla">
      ${aulas.map(filaAula).join('\n      ')}
    </tbody>
  </table>
  <p class="nota">Pintada por el servidor a las ${new Date().toLocaleTimeString('es-ES')}</p>
</body>
</html>`;
}

// GET /aulas: busca las aulas y responde con la página ya pintada
app.get('/aulas', async (req, res) => {
  const aulas = await Aula.find();
  res.send(paginaAulas(aulas));
});

// Paso 4 · CREAR desde el formulario de la página (sin JavaScript)
app.post('/aulas', async (req, res) => {
  await Aula.create(req.body);
  res.redirect('/aulas');      // vuelve a la lista, que el servidor pinta de nuevo
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
