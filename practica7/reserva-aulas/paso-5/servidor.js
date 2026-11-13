// Reserva de aulas · sesión 18 · paso 5: solo quien creó un aula puede borrarla (403)
const express = require('express');
const mongoose = require('mongoose');
const { Aula, paginaAulas } = require('./aulas');   // el modelo y la página de aulas
const crypto = require('crypto');                   // Paso 1 · viene con Node: no se instala
const jwt = require('jsonwebtoken');                // Paso 2 · npm install jsonwebtoken
const cookieParser = require('cookie-parser');      // Paso 4 · npm install cookie-parser

const app = express();
app.use(express.json());              // lee el JSON que llega en el cuerpo (req.body)
app.use(express.urlencoded());        // lee lo que envía un <form> sin JavaScript
app.use(express.static('publico'));   // sirve las páginas de la carpeta publico
app.use(cookieParser());              // Paso 4 · lee las cookies que manda el navegador (req.cookies)

// El modelo: cómo es un usuario
const Usuario = mongoose.model('Usuario', new mongoose.Schema({
  nombre: { type: String, required: true },
  email:  { type: String, required: true },
  clave:  { type: String, select: false }   // Paso 1 · el hash de la clave; select: false: no sale al buscar
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

// ===== Paso 1 · Darse de alta con una clave =====

// Nunca guardamos la clave: guardamos «sal:hash».
// La sal es aleatoria; así, dos usuarios con la misma clave guardan cosas distintas.
function hashDeClave(clave) {
  const sal = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(clave, sal, 64).toString('hex');
  return sal + ':' + hash;
}

// REGISTRO
app.post('/api/registro', async (req, res) => {
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

// ===== Paso 2 · Entrar: email y clave a cambio de un token =====

const SECRETO = 'cambia-este-secreto';   // con él se firma y se comprueba cada token

// ¿Es esta la clave? Repetimos el hash con LA MISMA sal y comparamos
function claveCorrecta(clave, guardada) {
  const [sal, hash] = guardada.split(':');
  const otro = crypto.scryptSync(clave, sal, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(otro, 'hex'));
}

// Si el email y la clave son buenos, devuelve un token firmado; si no, null
async function entrar(email, clave) {
  if (!email || !clave) return null;
  const usuario = await Usuario.findOne({ email }).select('+clave');   // aquí sí pedimos la clave
  if (!usuario || !usuario.clave || !claveCorrecta(clave, usuario.clave)) return null;
  return jwt.sign({ sub: String(usuario._id), nombre: usuario.nombre }, SECRETO, { expiresIn: '1h' });
}

// LOGIN
app.post('/api/login', async (req, res) => {
  const token = await entrar(req.body.email, req.body.clave);
  if (!token) return res.status(401).json({ error: 'Email o clave incorrectos' });
  res.json({ token });
});

// ===== Paso 3 · El portero: sin un token bueno, no se pasa =====

// Lee el token (Paso 4: de la cookie o de la cabecera «Authorization: Bearer …»).
// Si la firma es buena y no ha caducado, devuelve lo que dice dentro; si no, null.
function leerToken(req) {
  // Paso 4 · primero, la cookie que guarda el navegador; si no hay, la cabecera
  const token = req.cookies.token || (req.headers.authorization || '').replace('Bearer ', '');
  try {
    return jwt.verify(token, SECRETO);   // ¡verify, no decode! decode no comprueba la firma
  } catch {
    return null;                          // firma mala, caducado o basura
  }
}

// Se pone delante de las rutas que solo puede usar quien ha entrado
function requiereLogin(req, res, next) {
  req.usuario = leerToken(req);
  if (!req.usuario) return res.status(401).json({ error: 'Tienes que entrar primero' });
  next();
}

// ===== La API de aulas (sesión 17) =====

// CREAR (Paso 3 · con requiereLogin delante: sin token, 401)
app.post('/api/aulas', requiereLogin, async (req, res) => {
  const aula = await Aula.create({ ...req.body, creadaPor: req.usuario.sub });   // Paso 5
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

// ACTUALIZAR (Paso 3)
app.put('/api/aulas/:id', requiereLogin, async (req, res) => {
  const aula = await Aula.findByIdAndUpdate(req.params.id, req.body,
    { returnDocument: 'after', runValidators: true });
  if (!aula) return res.status(404).json({ error: 'Esa aula no existe' });
  res.json(aula);
});

// BORRAR (Paso 3)
app.delete('/api/aulas/:id', requiereLogin, async (req, res) => {
  const aula = await Aula.findById(req.params.id);
  if (!aula) return res.status(404).json({ error: 'Esa aula no existe' });
  // Paso 5 · sé quién eres, pero esta aula no es tuya: 403
  if (String(aula.creadaPor) !== req.usuario.sub) {
    return res.status(403).json({ error: 'Solo quien creó el aula puede borrarla' });
  }
  await aula.deleteOne();
  res.status(204).end();
});

// ===== La página de aulas, pintada en el servidor (sesión 17) =====

// GET /aulas: busca las aulas y responde con la página ya pintada
app.get('/aulas', async (req, res) => {
  const aulas = await Aula.find();
  res.send(paginaAulas(aulas, leerToken(req)));   // Paso 4 · y quién ha entrado (o null)
});

// CREAR desde el formulario de la página (sin JavaScript) · Paso 4: también con requiereLogin
app.post('/aulas', requiereLogin, async (req, res) => {
  await Aula.create({ ...req.body, creadaPor: req.usuario.sub });   // Paso 5
  res.redirect('/aulas');      // vuelve a la lista, que el servidor pinta de nuevo
});

// ===== Paso 4 · Entrar desde la página, sin JavaScript =====

// La página con el formulario de entrar (mensaje: el error que enseñamos, si lo hay)
function paginaEntrar(mensaje) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Entrar</title>
  <link rel="stylesheet" href="/estilo.css">
</head>
<body>
  <nav><a href="/">Usuarios</a> · <a href="/aulas">Aulas</a></nav>
  <h1>Entrar</h1>
  <p class="error">${mensaje}</p>
  <form method="post" action="/entrar">
    <input name="email" type="email" placeholder="Email" required>
    <input name="clave" type="password" placeholder="Clave" required>
    <button>Entrar</button>
  </form>
</body>
</html>`;
}

app.get('/entrar', (req, res) => {
  res.send(paginaEntrar(''));
});

// Si la clave es buena, el token se guarda en una cookie: el navegador la manda sola en cada petición
app.post('/entrar', async (req, res) => {
  const token = await entrar(req.body.email, req.body.clave);
  if (!token) return res.status(401).send(paginaEntrar('Email o clave incorrectos'));
  res.cookie('token', token, {
    httpOnly: true,           // el JavaScript de la página no puede leerla
    sameSite: 'lax',          // no viaja en los POST que lanzan otras webs
    maxAge: 60 * 60 * 1000    // 1 hora, como el token (¡aquí en milisegundos!)
  });
  res.redirect('/aulas');
});

app.post('/salir', (req, res) => {
  res.clearCookie('token');
  res.redirect('/aulas');
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
