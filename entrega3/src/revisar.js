/*
 * revisar.js — radiografía de un proyecto npm.
 *
 * Uso, desde la carpeta del proyecto:
 *   node revisar.js
 *
 * Lee package.json y, si existe, package-lock.json, y cuenta cuántos paquetes
 * trae cada dependencia (contando las dependencias de sus dependencias).
 * No opina: solo mide. Opinar es tu trabajo.
 */

const fs = require('node:fs');
const path = require('node:path');

const carpeta = process.argv[2] ? path.resolve(process.argv[2]) : __dirname;
const leer = f => JSON.parse(fs.readFileSync(path.join(carpeta, f), 'utf8'));

if (!fs.existsSync(path.join(carpeta, 'package.json'))) {
  console.log('No hay package.json en esta carpeta. Todavía no es un proyecto npm.');
  process.exit(1);
}

const pkg = leer('package.json');
const lock = fs.existsSync(path.join(carpeta, 'package-lock.json')) ? leer('package-lock.json') : null;
const paquetes = lock?.packages ?? {};

// Dónde ha instalado npm la dependencia «nombre» pedida desde «desde»:
// primero en su propio node_modules, luego subiendo hacia la raíz.
function resolver(desde, nombre) {
  let base = desde;
  while (true) {
    const candidato = (base ? base + '/' : '') + 'node_modules/' + nombre;
    if (paquetes[candidato]) return candidato;
    if (!base) return null;
    const corte = base.lastIndexOf('/node_modules/');
    base = corte === -1 ? '' : base.slice(0, corte);
  }
}

// Algunos paquetes solo se instalan en un sistema concreto (p. ej. fsevents, solo en macOS).
function encaja(lista, actual) {
  if (!lista) return true;
  if (lista.includes('!' + actual)) return false;
  const si = lista.filter(x => !x.startsWith('!'));
  return si.length === 0 || si.includes(actual);
}
const aplica = ruta => encaja(paquetes[ruta].os, process.platform) && encaja(paquetes[ruta].cpu, process.arch);

// Todos los paquetes que arrastra una dependencia, ella incluida.
function arrastra(ruta, vistos = new Set()) {
  if (!ruta || vistos.has(ruta) || !aplica(ruta)) return vistos;
  vistos.add(ruta);
  const info = paquetes[ruta];
  const deps = { ...info.dependencies, ...info.optionalDependencies };
  for (const nombre of Object.keys(deps)) arrastra(resolver(ruta, nombre), vistos);
  return vistos;
}

function bloque(titulo, deps) {
  const nombres = Object.keys(deps ?? {});
  console.log(`\n${titulo} (${nombres.length})`);
  if (nombres.length === 0) console.log('  — ninguna —');
  for (const nombre of nombres) {
    const ruta = resolver('', nombre);
    const instalada = ruta ? paquetes[ruta].version : null;
    let linea = `  ${nombre.padEnd(22)} ${String(deps[nombre]).padEnd(10)}`;
    if (!lock) linea += '  (sin package-lock.json: no se puede contar)';
    else if (!instalada) linea += '  no aparece en package-lock.json';
    else linea += `  instalada ${instalada.padEnd(9)} → ${arrastra(ruta).size} paquete(s)`;
    console.log(linea);
  }
}

console.log(`Radiografía de ${pkg.name ?? '(sin nombre)'}@${pkg.version ?? '?'}`);
console.log('='.repeat(60));

console.log('\nScripts');
const scripts = pkg.scripts ?? {};
if (Object.keys(scripts).length === 0) console.log('  — ninguno —');
for (const [nombre, orden] of Object.entries(scripts)) console.log(`  npm run ${nombre.padEnd(8)} →  ${orden}`);
for (const imprescindible of ['start', 'test']) {
  if (!scripts[imprescindible]) console.log(`  ⚠ falta el script «${imprescindible}»`);
}

bloque('Dependencias', pkg.dependencies);
bloque('Dependencias de desarrollo', pkg.devDependencies);

console.log('\nTotal');
if (lock) {
  const total = Object.keys(paquetes).filter(r => r !== '' && aplica(r)).length;
  console.log(`  En este sistema, node_modules tiene ${total} paquete(s).`);
} else {
  console.log('  No hay package-lock.json. Ejecuta npm install para que se genere.');
}

const gitignore = path.join(carpeta, '.gitignore');
const ignora = fs.existsSync(gitignore) && /^\/?node_modules\/?\s*$/m.test(fs.readFileSync(gitignore, 'utf8'));
console.log(`  .gitignore excluye node_modules: ${ignora ? 'sí' : 'NO'}`);
