// Lo que comparten servidor.js y generar.js: el modelo y cómo se pinta la página de aulas
const mongoose = require('mongoose');

// El modelo: cómo es un aula
const Aula = mongoose.model('Aula', new mongoose.Schema({
  nombre:    { type: String, required: true },
  capacidad: { type: Number, required: true, min: 1 },
  edificio:  { type: String, required: true }
}));

// Cambia los caracteres especiales de HTML por su versión escrita.
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

module.exports = { Aula, paginaAulas };
