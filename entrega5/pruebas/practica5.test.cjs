/*
 * Práctica 5 · Los siete tests de la especificación (R2 … R8).
 *
 *   1. MongoDB arrancado y el fichero .env hecho.
 *   2. Copia este fichero dentro de reserva-aulas/ (junto a servidor.js).
 *   3. Para tu servidor (Ctrl+C): el test arranca el suyo en el puerto 3000.
 *   4. node --test practica5.test.cjs
 *
 * R1 no tiene test: se comprueba leyendo el código.
 * Los datos de prueba se llaman «Prueba-…» y se borran al final.
 */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const path = require('node:path');
const mongoose = require(path.join(__dirname, 'node_modules', 'mongoose'));

const RAIZ = 'http://localhost:3000';
const RESERVAS = RAIZ + '/api/reservas';
const marca = 'Prueba-' + Date.now();
let servidor, ana, luis, aula;

const peticion = (method, url, body, token) => fetch(url, {
  method,
  headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
  body: body && JSON.stringify(body)
});
async function usuario(nombre) {
  const u = { nombre: `${marca}-${nombre}`, email: `${nombre}-${marca}@ua.es`.toLowerCase(), clave: 'clave-' + nombre };
  const r = await peticion('POST', RAIZ + '/api/registro', u);
  assert.equal(r.status, 201, 'no se puede registrar: ¿has cambiado /api/registro?');
  u._id = (await r.json())._id;
  u.token = (await (await peticion('POST', RAIZ + '/api/login', { email: u.email, clave: u.clave })).json()).token;
  return u;
}
let dia = 0;
const otraFecha = () => `2027-03-${String(10 + ++dia)}`;          // cada test, en un día distinto
const reserva = (extra) => ({ aula: aula._id, fecha: otraFecha(), franja: 10, ...extra });
const cuantas = () => mongoose.connection.collection('reservas').countDocuments({});

before(async () => {
  if (await fetch(RAIZ).then(() => true, () => false)) throw new Error('El puerto 3000 está ocupado: para tu servidor (Ctrl+C)');
  await mongoose.connect('mongodb://127.0.0.1:27017/reserva-aulas');
  servidor = spawn(process.execPath, ['servidor.js'], { cwd: __dirname });
  await new Promise((resolve, reject) => {
    let salida = '';
    const plazo = setTimeout(() => reject(new Error('El servidor no arranca:\n' + salida)), 15000);
    const leer = d => { salida += d; if (salida.includes('http://localhost:3000')) { clearTimeout(plazo); resolve(); } };
    servidor.stdout.on('data', leer);
    servidor.stderr.on('data', leer);
    servidor.on('exit', () => { clearTimeout(plazo); reject(new Error('El servidor se ha parado:\n' + salida)); });
  });
  ana = await usuario('Ana');
  luis = await usuario('Luis');
  const r = await peticion('POST', RAIZ + '/api/aulas', { nombre: marca, capacidad: 30, edificio: 'Politécnica' }, ana.token);
  assert.equal(r.status, 201);
  aula = await r.json();
});

after(async () => {
  const ids = [ana, luis].filter(Boolean).map(u => new mongoose.Types.ObjectId(u._id));
  await mongoose.connection.collection('reservas').deleteMany({ $or: [{ usuario: { $in: ids } }, { aula: aula && new mongoose.Types.ObjectId(aula._id) }] }).catch(() => {});
  await mongoose.connection.collection('usuarios').deleteMany({ nombre: { $regex: '^Prueba-' } });
  await mongoose.connection.collection('aulas').deleteMany({ nombre: { $regex: '^Prueba-' } });
  await mongoose.disconnect();
  if (servidor) { servidor.removeAllListeners('exit'); servidor.kill(); }
});

test('R2 · sin token, o con un token malo: 401 y no se crea nada', async () => {
  const antes = await cuantas();
  assert.equal((await peticion('POST', RESERVAS, reserva())).status, 401);
  assert.equal((await peticion('POST', RESERVAS, reserva(), 'esto-no-es-un-token')).status, 401);
  assert.equal(await cuantas(), antes);
});

test('R3 · 201, y la reserva es de quien dice el token (el usuario del cuerpo no cuenta)', async () => {
  const r = await peticion('POST', RESERVAS, reserva({ usuario: luis._id }), ana.token);
  assert.equal(r.status, 201);
  const creada = await r.json();
  const guardada = await mongoose.connection.collection('reservas').findOne({ _id: new mongoose.Types.ObjectId(creada._id) });
  assert.ok(guardada, 'la reserva no está en la colección reservas');
  assert.equal(String(guardada.usuario), ana._id);
});

test('R4 · datos malos: 400 y no se crea nada', async () => {
  const antes = await cuantas();
  const malos = [
    { aula: aula._id, fecha: otraFecha() },                       // falta la franja
    { aula: aula._id, franja: 10 },                               // falta la fecha
    { fecha: otraFecha(), franja: 10 },                           // falta el aula
    reserva({ fecha: '15/03/2027' }),                             // no es AAAA-MM-DD
    reserva({ fecha: '2027-02-30' }),                             // ese día no existe
    reserva({ franja: 7 }), reserva({ franja: 21 }), reserva({ franja: 9.5 }),
    reserva({ aula: '123' }),                                     // _id mal escrito
    reserva({ aula: { $ne: null } }),                             // un objeto donde iba un texto
    reserva({ fecha: { $ne: null } }),
    reserva({ franja: { $gt: 0 } })
  ];
  for (const cuerpo of malos) {
    const r = await peticion('POST', RESERVAS, cuerpo, ana.token);
    assert.equal(r.status, 400, JSON.stringify(cuerpo));
  }
  assert.equal(await cuantas(), antes);
});

test('R5 · un aula que no existe: 404', async () => {
  const r = await peticion('POST', RESERVAS, reserva({ aula: '000000000000000000000000' }), ana.token);
  assert.equal(r.status, 404);
});

test('R6 · la misma aula, el mismo día a la misma hora: 409, sea de quien sea', async () => {
  const una = reserva({ franja: 12 });
  assert.equal((await peticion('POST', RESERVAS, una, ana.token)).status, 201);
  assert.equal((await peticion('POST', RESERVAS, una, luis.token)).status, 409);
  assert.equal((await peticion('POST', RESERVAS, una, ana.token)).status, 409);
  assert.equal((await peticion('POST', RESERVAS, { ...una, franja: 13 }, luis.token)).status, 201);   // otra hora, sí
});

test('R7 · GET /api/reservas: 200, una lista, sin emails ni claves', async () => {
  assert.equal((await peticion('POST', RESERVAS, reserva(), ana.token)).status, 201);
  const r = await fetch(RESERVAS);
  assert.equal(r.status, 200);
  const texto = await r.text();
  const lista = JSON.parse(texto);
  assert.ok(Array.isArray(lista) && lista.length > 0);
  assert.ok(!texto.includes(ana.email) && !texto.includes(luis.email), 'la respuesta enseña emails');
  assert.doesNotMatch(texto, /"clave"/);
});

test('R8 · anular: 401 sin token, 403 la de otro, 404 si no existe, 204 la tuya', async () => {
  const r = await peticion('POST', RESERVAS, reserva(), ana.token);
  assert.equal(r.status, 201);
  const id = (await r.json())._id;
  assert.equal((await peticion('DELETE', `${RESERVAS}/${id}`)).status, 401);
  assert.equal((await peticion('DELETE', `${RESERVAS}/${id}`, undefined, luis.token)).status, 403);
  assert.equal((await peticion('DELETE', `${RESERVAS}/000000000000000000000000`, undefined, ana.token)).status, 404);
  assert.equal((await peticion('DELETE', `${RESERVAS}/${id}`, undefined, ana.token)).status, 204);
  assert.equal((await peticion('DELETE', `${RESERVAS}/${id}`, undefined, ana.token)).status, 404);
});
