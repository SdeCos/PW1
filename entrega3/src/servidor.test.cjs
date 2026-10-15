/*
 * Tests de la práctica 3.   Ejecuta:  node --test   (o npm test, cuando exista)
 * NO MODIFIQUES ESTE FICHERO.
 *
 * Arrancan «node servidor.js» con la variable de entorno PORT=3310 y le hacen
 * peticiones de verdad con fetch. No les importa si dentro hay http o Express:
 * solo miran lo que responde. Por eso sirven de referencia al migrar.
 */

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const path = require('node:path');

const PUERTO = 3310;
const BASE = `http://localhost:${PUERTO}`;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
let servidor;
let salida = '';

before(async () => {
  servidor = spawn(process.execPath, ['servidor.js'], {
    cwd: __dirname,
    env: { ...process.env, PORT: String(PUERTO) }
  });
  servidor.stdout.on('data', d => { salida += d; });
  servidor.stderr.on('data', d => { salida += d; });
  // Espera hasta 5 segundos a que el servidor conteste.
  for (let i = 0; i < 50; i++) {
    try { await fetch(`${BASE}/productos`); return; } catch { await new Promise(r => setTimeout(r, 100)); }
  }
  throw new Error(`El servidor no arranca en el puerto ${PUERTO}. Lo que ha escrito:\n${salida}`);
});

after(() => servidor.kill());

function crear(cuerpo, tipo = 'application/json') {
  return fetch(`${BASE}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': tipo },
    body: typeof cuerpo === 'string' ? cuerpo : JSON.stringify(cuerpo)
  });
}

test('1 · GET /productos devuelve los tres productos iniciales, en JSON', async () => {
  const r = await fetch(`${BASE}/productos`);
  assert.equal(r.status, 200);
  assert.match(r.headers.get('content-type') ?? '', /application\/json/);
  const lista = await r.json();
  assert.ok(Array.isArray(lista), 'Tiene que devolver un array');
  assert.deepEqual(lista.slice(0, 3).map(p => p.nombre), ['Taza', 'Lámpara', 'Vela']);
});

test('2 · GET /productos/:id devuelve ese producto', async () => {
  const [primero] = await (await fetch(`${BASE}/productos`)).json();
  const r = await fetch(`${BASE}/productos/${primero.id}`);
  assert.equal(r.status, 200);
  assert.equal((await r.json()).nombre, 'Taza');
});

test('3 · un producto que no existe da 404', async () => {
  const r = await fetch(`${BASE}/productos/no-existe`);
  assert.equal(r.status, 404);
});

test('4 · una ruta que no existe da 404', async () => {
  const r = await fetch(`${BASE}/clientes`);
  assert.equal(r.status, 404);
});

test('5 · POST /productos crea un producto y luego se puede pedir', async () => {
  const r = await crear({ nombre: 'Cojín', precio: 15 });
  assert.equal(r.status, 201);
  const nuevo = await r.json();
  assert.equal(nuevo.nombre, 'Cojín');
  assert.equal(nuevo.precio, 15);
  assert.ok(nuevo.id !== undefined, 'El producto creado tiene que llevar id');
  const otra = await fetch(`${BASE}/productos/${nuevo.id}`);
  assert.equal(otra.status, 200);
  assert.equal((await otra.json()).nombre, 'Cojín');
});

test('6 · el id de un producto nuevo es un UUID', async () => {
  const nuevo = await (await crear({ nombre: 'Plato', precio: 5 })).json();
  assert.match(String(nuevo.id), UUID, `Esperaba un UUID y ha llegado: ${nuevo.id}`);
});

test('7 · dos productos nuevos no comparten id', async () => {
  const a = await (await crear({ nombre: 'Mantel', precio: 12 })).json();
  const b = await (await crear({ nombre: 'Mantel', precio: 12 })).json();
  assert.notEqual(a.id, b.id);
});

test('8 · sin nombre, o con nombre vacío, da 400', async () => {
  assert.equal((await crear({ precio: 10 })).status, 400);
  assert.equal((await crear({ nombre: '   ', precio: 10 })).status, 400);
});

test('9 · precio cero o negativo da 400', async () => {
  assert.equal((await crear({ nombre: 'Gratis', precio: 0 })).status, 400);
  assert.equal((await crear({ nombre: 'Raro', precio: -3 })).status, 400);
});

test('10 · el precio tiene que ser un número, no un texto', async () => {
  assert.equal((await crear({ nombre: 'Taza', precio: '10' })).status, 400);
});

test('11 · un cuerpo que no es JSON da 400', async () => {
  assert.equal((await crear('{ nombre: Taza ')).status, 400);
});

test('12 · los productos inválidos no se guardan', async () => {
  const antes = (await (await fetch(`${BASE}/productos`)).json()).length;
  await crear({ nombre: 'Taza', precio: '10' });
  await crear({ precio: 10 });
  const despues = (await (await fetch(`${BASE}/productos`)).json()).length;
  assert.equal(despues, antes);
});
