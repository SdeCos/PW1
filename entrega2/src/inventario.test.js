/*
 * Tests de inventario.js
 *
 * Ejecútalos con:   node --test
 *
 * NO MODIFIQUES ESTE FICHERO. Estos tests describen lo que el módulo hace hoy
 * en producción. Si después de modernizar el código alguno se pone en rojo,
 * el problema está en el código nuevo, no aquí.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const inv = require('./inventario');

test('el módulo carga y crea la tienda por defecto', () => {
  assert.equal(inv.TIENDA_POR_DEFECTO.nombre, 'Sin nombre');
});

test('Producto calcula el precio con IVA', () => {
  const p = new inv.Producto('Taza', 10, 3);
  assert.equal(p.precioConIva(), 12.1);
});

test('Producto genera su descripción', () => {
  const p = new inv.Producto('Taza', 10, 3);
  assert.equal(p.descripcion(), 'Taza (12.1 €)');
});

test('valorPorDefecto respeta los valores que existen, aunque sean falsos', () => {
  assert.equal(inv.valorPorDefecto(0, 5), 0);
  assert.equal(inv.valorPorDefecto('', 'x'), '');
  assert.equal(inv.valorPorDefecto(false, true), false);
});

test('valorPorDefecto sustituye null', () => {
  assert.equal(inv.valorPorDefecto(null, 5), 5);
});

test('valorPorDefecto sustituye undefined', () => {
  assert.equal(inv.valorPorDefecto(undefined, 5), 5);
});

test('sumar suma cualquier número de argumentos', () => {
  assert.equal(inv.sumar(), 0);
  assert.equal(inv.sumar(1, 2, 3), 6);
  assert.equal(inv.sumar(10, 20, 30, 40), 100);
});

test('clasificar etiqueta el stock', () => {
  assert.equal(inv.clasificar(0), 'agotado');
  assert.equal(inv.clasificar(3), 'pocas unidades');
  assert.equal(inv.clasificar(50), 'disponible');
});

test('crearAvisos devuelve un aviso distinto para cada producto', () => {
  const avisos = inv.crearAvisos(['tazas', 'platos', 'vasos']);
  assert.equal(avisos.length, 3);
  assert.equal(avisos[0](), 'Revisa el stock de tazas');
  assert.equal(avisos[2](), 'Revisa el stock de vasos');
});

test('ordenarPorPrecio devuelve la lista ordenada', () => {
  const lista = [new inv.Producto('B', 5, 1), new inv.Producto('A', 2, 1), new inv.Producto('C', 9, 1)];
  const ordenada = inv.ordenarPorPrecio(lista);
  assert.deepEqual(ordenada.map(p => p.nombre), ['A', 'B', 'C']);
});

test('masBarato encuentra el producto más barato', () => {
  const lista = [new inv.Producto('B', 5, 1), new inv.Producto('A', 2, 1), new inv.Producto('C', 9, 1)];
  assert.equal(inv.masBarato(lista).nombre, 'A');
});

test('la tienda añade productos y permite encadenar', () => {
  const t = inv.crearTienda('La Tiendecita');
  t.anadir(new inv.Producto('Taza', 10, 3)).anadir(new inv.Producto('Plato', 5, 2));
  assert.equal(t.productos.length, 2);
});

test('la tienda genera su resumen', () => {
  const t = inv.crearTienda('La Tiendecita');
  t.anadir(new inv.Producto('Taza', 10, 3));
  assert.deepEqual(t.resumen(), ['La Tiendecita: Taza (12.1 €)']);
});

test('la tienda calcula su valor total', () => {
  const t = inv.crearTienda('La Tiendecita');
  t.anadir(new inv.Producto('Taza', 10, 3)).anadir(new inv.Producto('Plato', 5, 2));
  assert.equal(t.valorTotal(), 48.4);
});
