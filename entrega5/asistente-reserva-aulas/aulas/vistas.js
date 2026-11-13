// Las vistas de aulas: funciones que devuelven la página como texto HTML.
// Las usan dos: las rutas de la página (/aulas) y generar.js.

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

// En la barra: quién ha entrado y el botón de salir, o el enlace para entrar
function barraUsuario(usuario) {
  if (!usuario) return '<a href="/reservas">Reservas</a> · <a href="/entrar">Entrar</a>';
  return `Has entrado como <b>${escaparHTML(usuario.nombre)}</b>
    · <a href="/reservas">Reservas</a>
    <form method="post" action="/salir"><button>Salir</button></form>`;
}

// Una fila de la tabla, como texto HTML (con cada dato escapado)
function filaAula(aula) {
  return `<tr><td>${escaparHTML(aula.nombre)}</td><td>${escaparHTML(aula.capacidad)}</td><td>${escaparHTML(aula.edificio)}</td></tr>`;
}

// La página entera, como texto HTML, con las filas ya dentro
function paginaAulas(aulas, usuario) {   // usuario: lo que dice el token, o null
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Aulas</title>
  <link rel="stylesheet" href="/estilo.css">
</head>
<body>
  <nav><a href="/">Usuarios</a> · <b>Aulas</b> · ${barraUsuario(usuario)}</nav>
  <h1>Aulas</h1>
  ${usuario ? `<form method="post" action="/aulas">
    <input name="nombre" placeholder="Nombre" required>
    <input name="capacidad" type="number" min="1" placeholder="Capacidad" required>
    <input name="edificio" placeholder="Edificio" required>
    <button>Crear</button>
  </form>` : '<p>Para crear aulas, <a href="/entrar">entra</a>.</p>'}
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

module.exports = { paginaAulas };
