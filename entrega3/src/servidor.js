const { loadEnvFile } = require("node:process");
const { randomUUID } = require("node:crypto");
const express = require("express");

try {
  loadEnvFile();
} catch (err) {
  if (err.code !== "ENOENT") throw err;
}

const app = express();
const PUERTO = process.env.PORT || 3010;

// Middleware de registro (Log) con formato dd/mm/aaaa hh:mm:ss
app.use((req, res, next) => {
  const ahora = new Date();
  const dia = String(ahora.getDate()).padStart(2, "0");
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const anio = ahora.getFullYear();
  const horas = String(ahora.getHours()).padStart(2, "0");
  const minutos = String(ahora.getMinutes()).padStart(2, "0");
  const segundos = String(ahora.getSeconds()).padStart(2, "0");

  console.log(
    `[${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}] ${req.method} ${req.url}`,
  );
  next();
});

// El registro anterior incluye también las peticiones con JSON inválido.
app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "El cuerpo no es JSON válido" });
  }
  next(err);
});

// Datos iniciales
const productos = [
  { id: 1, nombre: "Taza", precio: 8 },
  { id: 2, nombre: "Lámpara", precio: 35 },
  { id: 3, nombre: "Vela", precio: 4 },
];

// Rutas
app.get("/productos", (req, res) => {
  res.status(200).json(productos);
});

app.get("/productos/:id", (req, res) => {
  const producto = productos.find((p) => String(p.id) === req.params.id);
  if (!producto) {
    return res.status(404).json({ error: "No existe ese producto" });
  }
  res.status(200).json(producto);
});

app.post("/productos", (req, res) => {
  const { nombre, precio } = req.body || {};

  // Validaciones
  if (typeof nombre !== "string" || nombre.trim() === "") {
    return res.status(400).json({ error: "Falta el nombre o no es válido" });
  }
  if (!Number.isFinite(precio) || precio <= 0) {
    return res
      .status(400)
      .json({ error: "El precio tiene que ser un número mayor que 0" });
  }

  const nuevo = {
    id: randomUUID(),
    nombre: nombre.trim(),
    precio,
  };

  productos.push(nuevo);
  res.status(201).json(nuevo);
});

// Manejador genérico para rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({ error: "No existe esa ruta" });
});

// Arrancar servidor
app.listen(PUERTO, (err) => {
  if (err) throw err;
  console.log(`Escuchando en http://localhost:${PUERTO}`);
});

// Exportamos la app por si los tests lo requieren para hacer aserciones (ej. Supertest)
module.exports = app;
