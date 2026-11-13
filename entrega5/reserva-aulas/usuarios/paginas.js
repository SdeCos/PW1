// Las páginas de usuarios: /entrar y /salir. Responde HTML, pintado en el servidor
const express = require('express');
const { entrar } = require('./sesion');

const router = express.Router();

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
  <nav><a href="/">Usuarios</a> · <a href="/aulas">Aulas</a> · <a href="/reservas">Reservas</a></nav>
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

router.get('/entrar', (req, res) => {
  res.send(paginaEntrar(''));
});

// Si la clave es buena, el token se guarda en una cookie: el navegador la manda sola en cada petición
router.post('/entrar', async (req, res) => {
  const token = await entrar(req.body.email, req.body.clave);
  if (!token) return res.status(401).send(paginaEntrar('Email o clave incorrectos'));
  res.cookie('token', token, {
    httpOnly: true,           // el JavaScript de la página no puede leerla
    sameSite: 'lax',          // no viaja en los POST que lanzan otras webs
    maxAge: 60 * 60 * 1000    // 1 hora, como el token (¡aquí en milisegundos!)
  });
  res.redirect('/aulas');
});

router.post('/salir', (req, res) => {
  res.clearCookie('token');
  res.redirect('/aulas');
});

module.exports = router;
