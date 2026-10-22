/*
 * Tests de la práctica 4.   Ejecuta:  node --test
 * NO MODIFIQUES ESTE FICHERO.
 *
 * Arrancan «node servidor.js» con PORT=3312 y le hacen peticiones de verdad.
 * Los tests van en orden y comparten el estado del servidor: un préstamo que
 * hace el test 4 sigue existiendo en el test 5.
 */

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const PUERTO = 3312;
const BASE = `http://localhost:${PUERTO}`;
const L1 = '978-84-0000-001-1', L2 = '978-84-0000-002-8', L3 = '978-84-0000-003-5', L4 = '978-84-0000-004-2';
let servidor, salida = '', prestamoL1;

const hoy = () => new Date().toISOString().slice(0, 10);
const masDias = (fecha, n) => new Date(Date.parse(fecha) + n * 86400000).toISOString().slice(0, 10);

before(async () => {
  servidor = spawn(process.execPath, ['servidor.js'], { cwd: __dirname, env: { ...process.env, PORT: String(PUERTO) } });
  servidor.stdout.on('data', d => { salida += d; });
  servidor.stderr.on('data', d => { salida += d; });
  for (let i = 0; i < 50; i++) {
    try { await fetch(`${BASE}/libros`); return; } catch { await new Promise(r => setTimeout(r, 100)); }
  }
  throw new Error(`El servidor no arranca en el puerto ${PUERTO}. Lo que ha escrito:\n${salida}`);
});
after(() => servidor.kill());

const pedir = (ruta, opciones) => fetch(BASE + ruta, { signal: AbortSignal.timeout(2000), ...opciones });
const prestar = cuerpo => pedir('/prestamos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) });

test('0 · sin dependencias', () => {
  const ruta = path.join(__dirname, 'package.json');
  if (!fs.existsSync(ruta)) return;
  const pkg = JSON.parse(fs.readFileSync(ruta, 'utf8'));
  assert.deepEqual(Object.keys(pkg.dependencies ?? {}), [], 'La especificación dice: sin dependencias');
});

test('1 · GET /libros: los cinco, todos disponibles, en JSON', async () => {
  const r = await pedir('/libros');
  assert.equal(r.status, 200);
  assert.match(r.headers.get('content-type') ?? '', /application\/json/);
  const libros = await r.json();
  assert.equal(libros.length, 5);
  assert.ok(libros.every(l => l.disponible === true), 'Al arrancar, todos tienen que tener disponible: true');
});

test('2 · GET /libros/:isbn devuelve ese libro', async () => {
  const r = await pedir(`/libros/${L2}`);
  assert.equal(r.status, 200);
  assert.equal((await r.json()).titulo, 'La Regenta');
});

test('3 · un ISBN que no existe: 404 con { error }', async () => {
  const r = await pedir('/libros/000');
  assert.equal(r.status, 404);
  assert.equal(typeof (await r.json()).error, 'string');
});

test('4 · POST /prestamos: 201, con fechas de inicio y de devolución', async () => {
  const r = await prestar({ isbn: L1, socio: 1 });
  assert.equal(r.status, 201);
  const p = await r.json();
  prestamoL1 = p.id;
  assert.equal(typeof p.id, 'number');
  assert.equal(p.isbn, L1);
  assert.equal(p.socio, 1);
  assert.equal(p.inicio, hoy(), 'inicio: la fecha de hoy, AAAA-MM-DD, en UTC');
  assert.equal(p.devolucion, masDias(hoy(), 14), 'devolucion: 14 días después del inicio');
});

test('5 · un libro prestado ya no está disponible', async () => {
  assert.equal((await (await pedir(`/libros/${L1}`)).json()).disponible, false);
});

test('6 · prestar un libro ya prestado: 409', async () => {
  assert.equal((await prestar({ isbn: L1, socio: 2 })).status, 409);
});

test('7 · faltan datos: 400', async () => {
  assert.equal((await prestar({ isbn: L2 })).status, 400);
  assert.equal((await prestar({})).status, 400);
});

test('8 · socio o libro que no existen: 404', async () => {
  assert.equal((await prestar({ isbn: L2, socio: 99 })).status, 404);
  assert.equal((await prestar({ isbn: '000', socio: 1 })).status, 404);
});

test('9 · como mucho tres préstamos a la vez por socio: el cuarto da 409', async () => {
  assert.equal((await prestar({ isbn: L2, socio: 1 })).status, 201);
  assert.equal((await prestar({ isbn: L3, socio: 1 })).status, 201);
  assert.equal((await prestar({ isbn: L4, socio: 1 })).status, 409);
});

test('10 · GET /socios/:id/prestamos: los activos del socio', async () => {
  const r = await pedir('/socios/1/prestamos');
  assert.equal(r.status, 200);
  assert.deepEqual((await r.json()).map(p => p.isbn).sort(), [L1, L2, L3]);
  assert.equal((await pedir('/socios/99/prestamos')).status, 404);
});

test('11 · DELETE /prestamos/:id devuelve el libro: 204', async () => {
  const r = await pedir(`/prestamos/${prestamoL1}`, { method: 'DELETE' });
  assert.equal(r.status, 204);
  assert.equal((await (await pedir(`/libros/${L1}`)).json()).disponible, true);
  assert.equal((await (await pedir('/socios/1/prestamos')).json()).length, 2);
});

test('12 · devolver un préstamo que no existe: 404', async () => {
  assert.equal((await pedir('/prestamos/9999', { method: 'DELETE' })).status, 404);
});

test('13 · una ruta que no existe: 404', async () => {
  assert.equal((await pedir('/revistas')).status, 404);
});
