// Paso 1 · Un servidor con Express que responde «hola»
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('¡Hola! El servidor funciona.');
});

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});
