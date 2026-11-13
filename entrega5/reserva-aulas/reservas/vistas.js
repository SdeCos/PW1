// Las vistas de reservas: funciones que devuelven la página como texto HTML.
function escaparHTML(texto) {
  return String(texto ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function fechaHoy() {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Madrid' }).format(new Date());
}

function fechaLegible(fecha) {
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'long', timeZone: 'UTC' }).format(fecha);
}

function barraUsuario(usuario) {
  if (!usuario) return '<a href="/entrar">Entrar</a>';
  return `Has entrado como <b>${escaparHTML(usuario.nombre)}</b>
    <form method="post" action="/salir"><button>Salir</button></form>`;
}

function paginaReservas(aulas, reservas, usuario, error) {
  const opcionesAula = aulas.map(aula =>
    `<option value="${escaparHTML(aula._id)}">${escaparHTML(aula.nombre)} · ${escaparHTML(aula.edificio)}</option>`
  ).join('\n      ');
  const filas = reservas.map(reserva => {
    const puedeAnular = usuario && String(reserva.usuario?._id) === usuario.sub;
    return `<tr>
      <td>${escaparHTML(reserva.aula?.nombre || 'Aula eliminada')}</td>
      <td>${escaparHTML(reserva.aula?.edificio || '')}</td>
      <td>${escaparHTML(fechaLegible(reserva.fecha))}</td>
      <td>${escaparHTML(reserva.hora)}</td>
      <td>${escaparHTML(reserva.usuario?.nombre || 'Usuario')}</td>
      <td>${puedeAnular ? `<form method="post" action="/reservas/${escaparHTML(reserva._id)}/anular"><button>Anular</button></form>` : ''}</td>
    </tr>`;
  }).join('\n      ');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Reservas</title>
  <link rel="stylesheet" href="/estilo.css">
</head>
<body>
  <nav><a href="/">Usuarios</a> · <a href="/aulas">Aulas</a> · <b>Reservas</b> · ${barraUsuario(usuario)}</nav>
  <h1>Reservas</h1>
  ${error ? `<p class="error">${escaparHTML(error)}</p>` : ''}
  ${usuario ? `<form method="post" action="/reservas">
    <select name="aula" required>
      <option value="">Elige un aula</option>
      ${opcionesAula}
    </select>
    <input name="fecha" type="date" min="${fechaHoy()}" required>
    <input name="hora" type="time" required>
    <button>Reservar</button>
  </form>` : '<p>Para reservar un aula, <a href="/entrar">entra</a>.</p>'}
  ${aulas.length ? '' : '<p class="nota">Todavía no hay aulas disponibles para reservar.</p>'}
  <table>
    <thead><tr><th>Aula</th><th>Edificio</th><th>Día</th><th>Hora</th><th>Reservada por</th><th></th></tr></thead>
    <tbody>${filas || '<tr><td colspan="6">Todavía no hay reservas.</td></tr>'}</tbody>
  </table>
</body>
</html>`;
}

module.exports = { paginaReservas };
