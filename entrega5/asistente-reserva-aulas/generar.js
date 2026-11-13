// SSG: pinta la página de aulas UNA SOLA VEZ y la guarda como fichero.
//   npm run generar
const fs = require('fs');
const mongoose = require('mongoose');
const Aula = require('./aulas/modelo');
const { paginaAulas } = require('./aulas/vistas');

mongoose.connect('mongodb://127.0.0.1:27017/reserva-aulas').then(async () => {
  const aulas = await Aula.find();
  fs.writeFileSync('publico/aulas-estatica.html', paginaAulas(aulas));
  console.log(`Generada publico/aulas-estatica.html con ${aulas.length} aulas`);
  await mongoose.disconnect();
});
