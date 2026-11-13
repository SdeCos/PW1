const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.static("publico"));

const Usuario = mongoose.model(
  "Usuario",
  new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true },
  }),
);

app.get("/", (req, res) => {
  res.send("¡Hola! El servidor funciona.");
});

app.post("/api/usuarios", async (req, res) => {
  const usuario = await Usuario.create(req.body);
  res.status(201).json(usuario);
});

app.get("/api/usuarios", async (req, res) => {
  const usuarios = await Usuario.find(); // todos
  res.json(usuarios);
});

app.get("/api/usuarios/:id", async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);
  if (!usuario) return res.status(404).json({ error: "Ese usuario no existe" });
  res.json(usuario);
});

app.put("/api/usuarios/:id", async (req, res) => {
  const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!usuario) return res.status(404).json({ error: "Ese usuario no existe" });
  res.json(usuario);
});

app.delete("/api/usuarios/:id", async (req, res) => {
  const usuario = await Usuario.findByIdAndDelete(req.params.id);
  if (!usuario) return res.status(404).json({ error: "Ese usuario no existe" });
  res.status(204).end(); // 204: hecho, y no hay nada que contar
});

mongoose
  .connect("mongodb://127.0.0.1:27017/usuarios-crud")
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(3000, () => {
      console.log("Servidor en http://localhost:3000");
    });
  })
  .catch((err) => {
    console.log("No puedo conectar con MongoDB. ¿Está arrancado?", err.message);
  });
