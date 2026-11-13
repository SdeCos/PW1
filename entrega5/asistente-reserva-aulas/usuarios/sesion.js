// Claves y tokens: todo lo que hace falta para saber quién eres
const crypto = require('crypto');        // viene con Node: no se instala
const jwt = require('jsonwebtoken');
const Usuario = require('./modelo');     // ./ es «en esta misma carpeta»: usuarios/modelo.js

// Nunca guardamos la clave: guardamos «sal:hash».
// La sal es aleatoria; así, dos usuarios con la misma clave guardan cosas distintas.
function hashDeClave(clave) {
  const sal = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(clave, sal, 64).toString('hex');
  return sal + ':' + hash;
}

// Paso 6 · El secreto ya no está escrito aquí: está en el fichero .env, que no se sube a git
try { process.loadEnvFile(); } catch { /* no hay fichero .env: lo decimos justo debajo */ }
const SECRETO = process.env.SECRETO;     // con él se firma y se comprueba cada token
if (!SECRETO || SECRETO.length < 32) {
  console.error('Falta el SECRETO (32 caracteres o más). Copia .env.ejemplo como .env y pon el tuyo.');
  process.exit(1);                       // mejor no arrancar que arrancar inseguro
}

// ¿Es esta la clave? Repetimos el hash con LA MISMA sal y comparamos
function claveCorrecta(clave, guardada) {
  const [sal, hash] = guardada.split(':');
  const otro = crypto.scryptSync(clave, sal, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(otro, 'hex'));
}

// Si el email y la clave son buenos, devuelve un token firmado; si no, null
async function entrar(email, clave) {
  // Paso 6 · solo textos: si llega un objeto ({ "$regex": … }), no entra
  if (typeof email !== 'string' || typeof clave !== 'string') return null;
  const usuario = await Usuario.findOne({ email }).select('+clave');   // aquí sí pedimos la clave
  if (!usuario || !usuario.clave || !claveCorrecta(clave, usuario.clave)) return null;
  return jwt.sign({ sub: String(usuario._id), nombre: usuario.nombre }, SECRETO, { expiresIn: '1h' });
}

// Lee el token de la cookie o de la cabecera «Authorization: Bearer …».
// Si la firma es buena y no ha caducado, devuelve lo que dice dentro; si no, null.
function leerToken(req) {
  // primero, la cookie que guarda el navegador; si no hay, la cabecera
  const token = req.cookies.token || (req.headers.authorization || '').replace('Bearer ', '');
  try {
    return jwt.verify(token, SECRETO);   // ¡verify, no decode! decode no comprueba la firma
  } catch {
    return null;                          // firma mala, caducado o basura
  }
}

// Se pone delante de las rutas que solo puede usar quien ha entrado
function requiereLogin(req, res, next) {
  req.usuario = leerToken(req);
  if (!req.usuario) return res.status(401).json({ error: 'Tienes que entrar primero' });
  next();
}

// Lo que pueden usar los demás ficheros. Lo que no sale aquí (SECRETO, claveCorrecta) no se ve desde fuera
module.exports = { hashDeClave, entrar, leerToken, requiereLogin };
