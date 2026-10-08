/*
 * medir.js — lanza dos peticiones casi a la vez y cronometra cada una.
 *
 * Uso (con el servidor arrancado en otra terminal):
 *   node medir.js lento
 *   node medir.js espera
 *
 * Primero pide /lento (o /espera) y, 200 ms después, pide /rapido.
 * La pregunta es: ¿cuánto tiene que esperar /rapido?
 */

const ruta = process.argv[2];
if (!['lento', 'espera'].includes(ruta)) {
  console.log('Uso: node medir.js lento   o   node medir.js espera');
  process.exit(1);
}

const BASE = 'http://localhost:3009';
const inicio = Date.now();

async function pedir(nombre) {
  const t0 = Date.now();
  try {
    const respuesta = await fetch(`${BASE}/${nombre}`);
    const texto = (await respuesta.text()).trim();
    const ms = Date.now() - t0;
    console.log(`/${nombre.padEnd(7)} → «${texto}» en ${ms} ms`);
  } catch (e) {
    console.log(`/${nombre}: no hay servidor escuchando en ${BASE}. ¿Lo has arrancado?`);
    process.exit(1);
  }
}

pedir(ruta);
setTimeout(() => pedir('rapido'), 200);
