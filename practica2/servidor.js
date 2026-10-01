/*
 * Programación Web I — Sesión 6
 * Servidor HTTP que sirve la carpeta public/ desde el disco.
 *
 * Esta es la versión corregida de la práctica de la sesión 5: comprueba que la
 * ruta no se sale de public/, distingue «no existe» de «no puedo leerlo», y
 * deduce el Content-Type de la extensión en lugar de mentir.
 *
 * Hoy no vamos a tocar nada de esto. Lo que vamos a cambiar es el transporte.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PUERTO = 3000;
const RAIZ = path.join(__dirname, 'public');

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

/*
 * El manejador de peticiones. Fíjate bien en esta función: es la misma, línea
 * por línea, que vas a usar con HTTPS. TLS no cambia la aplicación.
 */
function manejador(req, res) {
  // Quitamos la cadena de consulta y decodificamos el porcentaje.
  let recurso = decodeURIComponent(req.url.split('?')[0]);
  if (recurso === '/') recurso = '/index.html';

  // normalize() resuelve los «..» ANTES de unir. Después comprobamos que el
  // resultado sigue colgando de RAIZ. Las dos cosas, no una.
  const destino = path.join(RAIZ, path.normalize(recurso));
  if (!destino.startsWith(RAIZ + path.sep)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403 — fuera de la carpeta pública');
  }

  fs.readFile(destino, (err, datos) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 — no encontrado');
    }
    const tipo = TIPOS[path.extname(destino).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': tipo });
    res.end(datos);
  });
}

// Solo arranca el servidor si ejecutas ESTE fichero. Si otro fichero hace
// require('./servidor'), se lleva el manejador y nada más. Lo vas a necesitar
// dentro de un rato.
if (require.main === module) {
  http.createServer(manejador).listen(PUERTO, () => {
    console.log(`Escuchando en http://localhost:${PUERTO}`);
  });
}

module.exports = { manejador, TIPOS, RAIZ };
