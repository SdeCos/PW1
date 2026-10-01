/*
 * inventario.js
 * Módulo de gestión de inventario de «La Tiendecita».
 *
 * Escrito en 2012. Funciona, está en producción y nadie se atreve a tocarlo.
 * Hoy le toca a usted.
 */

const IVA = 0.21;


/* ---------- Productos ---------- */

class Producto {
  constructor(nombre, precio, stock) {
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }

  precioConIva() {
    return Math.round(this.precio * (1 + IVA) * 100) / 100;
  }

  descripcion() {
    return `${this.nombre} (${this.precioConIva()} €)`;
  }
}


/* ---------- Utilidades ---------- */

// Devuelve el valor, o el valor por defecto si no hay valor.
const valorPorDefecto = (valor, porDefecto) => valor ?? porDefecto;

// Suma todos los números que se le pasen.
const sumar = (...numeros) => numeros.reduce((total, numero) => total + numero, 0);

// Etiqueta de disponibilidad según el stock.
const clasificar = (stock) => {
  if (stock === 0) return 'agotado';
  if (stock < 5) return 'pocas unidades';
  return 'disponible';
};

// Crea una función de aviso por cada producto.
const crearAvisos = (nombres) => Array.from(
  nombres,
  (nombre) => () => `Revisa el stock de ${nombre}`
);


/* ---------- Listados ---------- */

const ordenarPorPrecio = (lista) => lista.sort((a, b) => a.precio - b.precio);

const masBarato = (lista) => {
  ordenarPorPrecio(lista);
  return lista[0];
};

const exportarCSV = (lista) => {
  const filas = ['nombre;precio;stock'];

  for (const { nombre, precio, stock } of lista) {
    filas.push(`${nombre};${precio};${stock}`);
  }

  return `${filas.join('\n')}\n`;
};


/* ---------- La tienda ---------- */

const crearTienda = (nombre) => ({
    nombre,
    productos: [],
    anadir(producto) {
      this.productos.push(producto);
      return this;
    },
    resumen() {
      return this.productos.map((producto) => `${this.nombre}: ${producto.descripcion()}`);
    },
    valorTotal() {
      const total = this.productos.reduce(
        (acumulado, producto) => acumulado + producto.precioConIva() * producto.stock,
        0
      );
      return Math.round(total * 100) / 100;
    }
  });

// La tienda por defecto se crea al cargar el módulo.
const TIENDA_POR_DEFECTO = crearTienda('Sin nombre');


module.exports = {
  IVA,
  TIENDA_POR_DEFECTO,
  Producto,
  valorPorDefecto,
  sumar,
  clasificar,
  crearAvisos,
  ordenarPorPrecio,
  masBarato,
  exportarCSV,
  crearTienda
};
