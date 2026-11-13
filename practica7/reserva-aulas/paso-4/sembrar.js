// Dado: llena la base de datos con 200 usuarios y 200 aulas para medir.
//   npm run sembrar          (borra antes los que haya)
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/reserva-aulas').then(async () => {
  const usuarios = mongoose.connection.collection('usuarios');
  const aulas = mongoose.connection.collection('aulas');
  await usuarios.deleteMany({});
  await aulas.deleteMany({});
  const n = 200;
  await usuarios.insertMany(Array.from({ length: n }, (_, i) =>
    ({ nombre: `Usuario ${i + 1}`, email: `usuario${i + 1}@ejemplo.com` })));
  await aulas.insertMany(Array.from({ length: n }, (_, i) =>
    ({ nombre: `Aula ${Math.floor(i / 20) + 1}.${String(i % 20 + 1).padStart(2, '0')}`,
       capacidad: 20 + (i % 5) * 10, edificio: ['Politécnica', 'Ciencias', 'Biblioteca'][i % 3] })));
  console.log(`Listo: ${n} usuarios y ${n} aulas`);
  await mongoose.disconnect();
});
