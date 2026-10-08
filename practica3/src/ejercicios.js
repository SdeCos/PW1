/*
 * Programación Web I — Sesión 8 · Ejercicios en clase
 * Régimen A: sin IA. Ni asistente, ni autocompletado inteligente, ni chat.
 *
 * Nueve funciones. Cada una se resuelve con map, filter o reduce.
 * Sin bucles: hay un test que comprueba que en este fichero no aparece
 * ningún for ni ningún while.
 *
 * Ejecuta los tests con:   node --test
 * Al principio saldrán todos en rojo. Ve poniéndolos en verde uno a uno.
 */

// 1. Devuelve un array con el doble de cada número.
//    dobles([1, 2, 3])  →  [2, 4, 6]
function dobles(numeros) {
  // Tu código aquí
  return numeros.map((x) => x * 2);
}

// 2. Devuelve solo los números pares.
//    soloPares([1, 2, 3, 4])  →  [2, 4]
function soloPares(numeros) {
  // Tu código aquí
  return numeros..filter(x => x%2 === 0);
}

// 3. Devuelve la suma de todos los números. Con un array vacío, 0.
//    total([1, 2, 3])  →  6
function total(numeros) {
  // Tu código aquí
}

// 4. Devuelve los nombres de los productos.
//    nombres([{ nombre: 'Taza', ... }, { nombre: 'Vela', ... }])  →  ['Taza', 'Vela']
function nombres(productos) {
  // Tu código aquí
}

// 5. Devuelve los NOMBRES de los productos cuyo precio es mayor que el límite.
//    masCarosQue(productos, 10)  →  ['Lámpara', 'Cojín']
function masCarosQue(productos, limite) {
  // Tu código aquí
}

// 6. Devuelve el valor del inventario: la suma de precio × stock de todos.
function valorInventario(productos) {
  // Tu código aquí
}

// 7. Devuelve los nombres de los productos agotados (stock 0), en mayúsculas.
//    Pista: se encadenan dos cosas.
function agotadosEnMayusculas(productos) {
  // Tu código aquí
}

// 8. Currying. conDescuento recibe un porcentaje y DEVUELVE UNA FUNCIÓN,
//    que recibe un precio y devuelve el precio rebajado.
//    conDescuento(10)(200)  →  180
//    const rebajas = conDescuento(20);  rebajas(50)  →  40
function conDescuento(porcentaje) {
  // Tu código aquí
}

// 9. RETO. Agrupa los nombres de los productos por categoría.
//    porCategoria(productos)  →  { menaje: ['Taza', 'Plato'], hogar: ['Lámpara', ...] }
//    Pista: reduce, empezando por un objeto vacío.
function porCategoria(productos) {
  // Tu código aquí
}

module.exports = {
  dobles,
  soloPares,
  total,
  nombres,
  masCarosQue,
  valorInventario,
  agotadosEnMayusculas,
  conDescuento,
  porCategoria,
};
