/*
 * Programación Web I — Sesión 6 · Solución del taller
 *
 * El mismo servidor de antes, por HTTPS. Compara los dos ficheros: la función
 * que responde a las peticiones no ha cambiado ni una línea. Lo único distinto
 * es el módulo que se usa para crear el servidor y las dos claves que se le
 * pasan. TLS es una capa por debajo de HTTP: la aplicación ni se entera.
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PUERTO_HTTPS = 3443;
const PUERTO_HTTP = 3000;
const CERTS = path.join(__dirname, '..', 'certificados');

// Aquí está toda la diferencia: el servidor necesita la clave privada y el
// certificado. La clave NUNCA sale de este ordenador; el certificado sí, se lo
// entrega a todo el que se conecta.
const credenciales = {
  key: fs.readFileSync(path.join(CERTS, 'clave-servidor.pem')),
  cert: fs.readFileSync(path.join(CERTS, 'certificado-servidor.pem'))
};

// El manejador es literalmente el de servidor.js. No lo reescribimos.
const { manejador } = require('../servidor');

// Añadimos HSTS: le dice al navegador «a partir de ahora, con este dominio,
// ni se te ocurra usar HTTP». Solo tiene efecto si llega por HTTPS.
function manejadorSeguro(req, res) {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  manejador(req, res);
}

https.createServer(credenciales, manejadorSeguro).listen(PUERTO_HTTPS, () => {
  console.log(`HTTPS escuchando en https://localhost:${PUERTO_HTTPS}`);
});

// Y el servidor de HTTP deja de servir páginas: solo manda al de al lado.
// 301 es permanente; el navegador se lo apunta y la próxima vez ni pregunta.
http.createServer((req, res) => {
  const destino = `https://localhost:${PUERTO_HTTPS}${req.url}`;
  res.writeHead(301, { Location: destino });
  res.end();
}).listen(PUERTO_HTTP, () => {
  console.log(`HTTP en ${PUERTO_HTTP} redirigiendo a HTTPS`);
});
