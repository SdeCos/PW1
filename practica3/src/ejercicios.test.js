/*
 * Tests de los ejercicios de la sesión 8.   Ejecuta:  node --test
 * No modifiques este fichero.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const e = require('./ejercicios');

const productos = [
  { nombre: 'Taza', precio: 8, stock: 12, categoria: 'menaje' },
  { nombre: 'Plato', precio: 5, stock: 0, categoria: 'menaje' },
  { nombre: 'Lámpara', precio: 35, stock: 3, categoria: 'hogar' },
  { nombre: 'Cojín', precio: 15, stock: 0, categoria: 'hogar' },
  { nombre: 'Vela', precio: 4, stock: 40, categoria: 'hogar' }
];

test('0 · sin bucles: ni for ni while en ejercicios.js', () => {
  const codigo = fs.readFileSync(path.join(__dirname, 'ejercicios.js'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')      // quita comentarios de bloque
    .replace(/\/\/.*$/gm, '');             // quita comentarios de línea
  assert.doesNotMatch(codigo, /\bfor\b/, 'Hay un for. Usa map, filter o reduce.');
  assert.doesNotMatch(codigo, /\bwhile\b/, 'Hay un while. Usa map, filter o reduce.');
});

test('1 · dobles', () => {
  const original = [1, 2, 3];
  assert.deepEqual(e.dobles(original), [2, 4, 6]);
  assert.deepEqual(original, [1, 2, 3], 'No modifiques el array original');
  assert.deepEqual(e.dobles([]), []);
});

test('2 · soloPares', () => {
  assert.deepEqual(e.soloPares([1, 2, 3, 4, 5, 6]), [2, 4, 6]);
  assert.deepEqual(e.soloPares([1, 3]), []);
});

test('3 · total', () => {
  assert.equal(e.total([1, 2, 3]), 6);
  assert.equal(e.total([10, -4]), 6);
  assert.equal(e.total([]), 0, 'Con un array vacío tiene que dar 0');
});

test('4 · nombres', () => {
  assert.deepEqual(e.nombres(productos), ['Taza', 'Plato', 'Lámpara', 'Cojín', 'Vela']);
});

test('5 · masCarosQue', () => {
  assert.deepEqual(e.masCarosQue(productos, 10), ['Lámpara', 'Cojín']);
  assert.deepEqual(e.masCarosQue(productos, 100), []);
});

test('6 · valorInventario', () => {
  assert.equal(e.valorInventario(productos), 361);
  assert.equal(e.valorInventario([]), 0);
});

test('7 · agotadosEnMayusculas', () => {
  assert.deepEqual(e.agotadosEnMayusculas(productos), ['PLATO', 'COJÍN']);
});

test('8 · conDescuento (currying)', () => {
  assert.equal(typeof e.conDescuento(10), 'function', 'conDescuento(10) tiene que devolver una función');
  assert.equal(e.conDescuento(10)(200), 180);
  const rebajas = e.conDescuento(20);
  assert.deepEqual([100, 50].map(rebajas), [80, 40]);
});

test('9 · RETO porCategoria', () => {
  assert.deepEqual(e.porCategoria(productos), {
    menaje: ['Taza', 'Plato'],
    hogar: ['Lámpara', 'Cojín', 'Vela']
  });
});
