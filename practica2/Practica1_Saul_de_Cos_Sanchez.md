# Practica 1 Saul de Cos Sanchez

## Prompt

Amplia este servidor para que sirva los ficheros de la carpeta public desde el disco

## Codigo

```
/* ============================================================
   Programación Web I — Sesión 5
   Código de partida de la práctica

   Este servidor funciona tal cual está. Compruébalo antes de
   tocar nada:

       node servidor.js

   y abre http://localhost:3000 en el navegador.

   Ahora mismo responde dos rutas y nada más. Las páginas están
   escritas dentro del propio código, a mano. Al lado de este
   fichero hay una carpeta public/ con ficheros de verdad
   (index.html, estilos.css, logo.svg) que este servidor NO sabe
   servir todavía.

   Tu encargo es que el asistente lo resuelva. Tu trabajo es
   auditar lo que te dé.
   ============================================================ */

const http = require('http');
const fs = require('fs');
const path = require('path');

const carpetaPublica = path.join(__dirname, 'public');
const tiposMime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function servirFicheroPublico(req, res) {
  let rutaSolicitada;

  try {
    rutaSolicitada = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Petición no válida');
    return;
  }

  const rutaRelativa = rutaSolicitada === '/' ? 'index.html' : rutaSolicitada.slice(1);
  const rutaFichero = path.resolve(carpetaPublica, rutaRelativa);

  if (rutaFichero !== carpetaPublica && !rutaFichero.startsWith(`${carpetaPublica}${path.sep}`)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Acceso no permitido');
    return;
  }

  fs.readFile(rutaFichero, (error, contenido) => {
    if (error) {
      if (error.code === 'ENOENT' || error.code === 'EISDIR') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 — Esto no existe</h1>');
        return;
      }

      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('No se pudo leer el fichero');
      return;
    }

    const extension = path.extname(rutaFichero).toLowerCase();
    const tipoMime = tiposMime[extension] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': tipoMime });
    res.end(contenido);
  });
}

const servidor = http.createServer((req, res) => {

  if (req.method !== 'GET') {
    res.writeHead(405, {
      'Allow': 'GET',
      'Content-Type': 'text/plain; charset=utf-8',
    });
    res.end('Método no permitido');

  } else if (req.url === '/acerca') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Acerca de</h1><p>Sesión 5 de Programación Web I.</p>');

  } else {
    servirFicheroPublico(req, res);
  }

});

servidor.listen(3000, () => {
  console.log('Escuchando en http://localhost:3000');
});
```

## Auditoria

| Comprobacion                                       | Resultado                                                                                                                                                                       |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ¿Arranca y sirve la página con estilos y logo?     | Si                                                                                                                                                                              |
| ¿Qué pasa si pides un fichero que no existe?       | 404 - No existe                                                                                                                                                                 |
| ¿Puede alguien salirse de la carpeta public?       | Ninguno de los curl lo permiten                                                                                                                                                 |
| ¿El Content-Type sale de la extensión o está fijo? | Dependen de la extension, usa MIME                                                                                                                                              |
| ¿Existe cada método que usa?                       | Si, todos los metodos existen                                                                                                                                                   |
| ¿Sabrías explicar cada línea si te pregunto?       | No, pese a que la gran mayoria de lineas si, hay algunas que no, como y otras, como los apartados de tiposMime, que al investigar que hacian he entendido pero no inicialmente, |

## Comparacion

Para la comparacion he hecho el mismo prompt en gemini 3.1 pro, he visto que la primera comprobacion (acceso a archivo inexistente), ha tenido el mismo resultado que codex, pero, al hacer los curls, el primero con /.. me ha dejado acceder al archivo privado, pero el segundo, el de %2e%2e%2f, si que me ha bloqueado correctamente

## Declaraciones

### Autoría

Declaro que he utilizado Codex como apoyo para proponer la implementación. He revisado el código, comprobado su funcionamiento y entiendo los cambios incluidos en esta entrega.

### Uso IA

| IA Utilizada      | Uso en esta entrega                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| Codex (Terra 5.6) | Prompt indicado en el enunciado y pequenas explicaciones de codigo que no entendia (tiposMime) |
| Gemini 3.1 Pro    | Segundo codigo para comparacion                                                                |
