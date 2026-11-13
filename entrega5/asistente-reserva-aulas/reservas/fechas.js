// Convierte una fecha YYYY-MM-DD a medianoche UTC sin aceptar fechas imposibles.
function parsearFecha(fecha) {
  if (typeof fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return null;
  const fechaUTC = new Date(`${fecha}T00:00:00.000Z`);
  if (Number.isNaN(fechaUTC.getTime()) || fechaUTC.toISOString().slice(0, 10) !== fecha) return null;
  return fechaUTC;
}

module.exports = { parsearFecha };
