/*
 * Programación Web I — Sesión 9 · Taller en clase (régimen A)
 *
 * Un servidor con una sola ruta que responde enseguida. Vas a añadirle dos
 * rutas que tardan 3 segundos cada una: una que BLOQUEA a Node y otra que
 * ESPERA sin bloquear. Luego medirás la diferencia con medir.js.
 *
 * Arranca con:   node servidor.js
 */

const http = require('http');

const PUERTO = 3009;

http.createServer((req, res) => {

  // Ruta 1 · Responde enseguida. No la toques.
  if (req.url === '/rapido') {
    return res.end('rapido\n');
  }

  // Ruta 2 · /lento — PASO 1 del taller.
  // Tiene que tardar 3 segundos «trabajando»: un bucle que no hace nada
  // hasta que pasen 3000 ms. Luego responde 'lento'.


  // Ruta 3 · /espera — PASO 3 del taller.
  // Tiene que tardar también 3 segundos, pero esperando con setTimeout.
  // Cuando pasen, responde 'espera'.


  res.statusCode = 404;
  res.end('no existe\n');

}).listen(PUERTO, () => {
  console.log(`Escuchando en http://localhost:${PUERTO}`);
});
