'use strict';

const http = require('node:http');

const puerto = obtenerPuerto(process.env.PORT);
const prestamos = new Map();
let siguienteId = 1;

const servidor = http.createServer(async (peticion, respuesta) => {
  try {
    await atenderPeticion(peticion, respuesta);
  } catch (error) {
    if (error instanceof ErrorHttp) {
      enviarJson(respuesta, error.estado, { error: error.message });
      return;
    }

    console.error(error);
    enviarJson(respuesta, 500, { error: 'Error interno del servidor' });
  }
});

async function atenderPeticion(peticion, respuesta) {
  const metodo = peticion.method ?? 'GET';
  const url = new URL(peticion.url ?? '/', 'http://localhost');
  const partes = url.pathname.split('/').filter(Boolean);

  if (metodo === 'GET' && url.pathname === '/salud') {
    enviarJson(respuesta, 200, { estado: 'ok' });
    return;
  }

  if (partes[0] !== 'prestamos' || partes.length > 2) {
    throw new ErrorHttp(404, 'Ruta no encontrada');
  }

  if (partes.length === 1 && metodo === 'GET') {
    enviarJson(respuesta, 200, [...prestamos.values()]);
    return;
  }

  if (partes.length === 1 && metodo === 'POST') {
    const datos = await leerJson(peticion);
    validarPrestamo(datos);

    const id = siguienteId++;
    const prestamo = {
      id,
      libroId: datos.libroId,
      usuarioId: datos.usuarioId,
      fechaPrestamo: datos.fechaPrestamo ?? fechaActual(),
      fechaDevolucion: datos.fechaDevolucion ?? null,
      devuelto: datos.devuelto ?? false,
    };

    prestamos.set(id, prestamo);
    enviarJson(respuesta, 201, prestamo, { Location: `/prestamos/${id}` });
    return;
  }

  if (partes.length !== 2) {
    throw new ErrorHttp(405, 'Metodo no permitido');
  }

  const id = Number(partes[1]);
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new ErrorHttp(400, 'El id del prestamo no es valido');
  }

  const prestamoExistente = prestamos.get(id);
  if (!prestamoExistente) {
    throw new ErrorHttp(404, 'Prestamo no encontrado');
  }

  if (metodo === 'GET') {
    enviarJson(respuesta, 200, prestamoExistente);
    return;
  }

  if (metodo === 'PUT' || metodo === 'PATCH') {
    const datos = await leerJson(peticion);
    const parcial = metodo === 'PATCH';
    validarPrestamo(datos, parcial);

    const prestamoActualizado = parcial
      ? { ...prestamoExistente, ...camposPermitidos(datos), id }
      : {
          id,
          libroId: datos.libroId,
          usuarioId: datos.usuarioId,
          fechaPrestamo: datos.fechaPrestamo ?? fechaActual(),
          fechaDevolucion: datos.fechaDevolucion ?? null,
          devuelto: datos.devuelto ?? false,
        };

    prestamos.set(id, prestamoActualizado);
    enviarJson(respuesta, 200, prestamoActualizado);
    return;
  }

  if (metodo === 'DELETE') {
    prestamos.delete(id);
    respuesta.writeHead(204);
    respuesta.end();
    return;
  }

  throw new ErrorHttp(405, 'Metodo no permitido');
}

function validarPrestamo(datos, parcial = false) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    throw new ErrorHttp(400, 'El cuerpo debe ser un objeto JSON');
  }

  if (!parcial || Object.hasOwn(datos, 'libroId')) {
    validarIdentificador(datos.libroId, 'libroId');
  }

  if (!parcial || Object.hasOwn(datos, 'usuarioId')) {
    validarIdentificador(datos.usuarioId, 'usuarioId');
  }

  for (const campo of ['fechaPrestamo', 'fechaDevolucion']) {
    if (datos[campo] !== undefined && datos[campo] !== null && !esFechaValida(datos[campo])) {
      throw new ErrorHttp(400, `${campo} debe ser una fecha valida`);
    }
  }

  if (datos.devuelto !== undefined && typeof datos.devuelto !== 'boolean') {
    throw new ErrorHttp(400, 'devuelto debe ser un booleano');
  }

  if (parcial && Object.keys(camposPermitidos(datos)).length === 0) {
    throw new ErrorHttp(400, 'No se ha proporcionado ningun campo actualizable');
  }
}

function validarIdentificador(valor, campo) {
  const valido =
    (typeof valor === 'string' && valor.trim() !== '') ||
    (Number.isSafeInteger(valor) && valor > 0);

  if (!valido) {
    throw new ErrorHttp(400, `${campo} es obligatorio y debe ser un identificador valido`);
  }
}

function esFechaValida(valor) {
  return typeof valor === 'string' && valor.trim() !== '' && !Number.isNaN(Date.parse(valor));
}

function camposPermitidos(datos) {
  const resultado = {};
  for (const campo of ['libroId', 'usuarioId', 'fechaPrestamo', 'fechaDevolucion', 'devuelto']) {
    if (Object.hasOwn(datos, campo)) resultado[campo] = datos[campo];
  }
  return resultado;
}

function leerJson(peticion) {
  return new Promise((resolve, reject) => {
    const fragmentos = [];
    let tamano = 0;
    const limite = 1024 * 1024;

    peticion.on('data', (fragmento) => {
      tamano += fragmento.length;
      if (tamano > limite) {
        reject(new ErrorHttp(413, 'El cuerpo de la peticion es demasiado grande'));
        peticion.destroy();
        return;
      }
      fragmentos.push(fragmento);
    });

    peticion.on('end', () => {
      try {
        const texto = Buffer.concat(fragmentos).toString('utf8');
        if (!texto.trim()) throw new ErrorHttp(400, 'El cuerpo JSON es obligatorio');
        resolve(JSON.parse(texto));
      } catch (error) {
        reject(
          error instanceof ErrorHttp
            ? error
            : new ErrorHttp(400, 'El cuerpo no contiene JSON valido'),
        );
      }
    });

    peticion.on('error', reject);
  });
}

function enviarJson(respuesta, estado, contenido, cabeceras = {}) {
  const cuerpo = JSON.stringify(contenido);
  respuesta.writeHead(estado, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(cuerpo),
    ...cabeceras,
  });
  respuesta.end(cuerpo);
}

function obtenerPuerto(valor) {
  if (valor === undefined || valor === '') return 3000;

  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero < 0 || numero > 65535) {
    console.error('PORT debe ser un numero entero entre 0 y 65535');
    process.exit(1);
  }
  return numero;
}

function fechaActual() {
  return new Date().toISOString().slice(0, 10);
}

class ErrorHttp extends Error {
  constructor(estado, mensaje) {
    super(mensaje);
    this.estado = estado;
  }
}

servidor.listen(puerto, () => {
  const direccion = servidor.address();
  const puertoActivo = typeof direccion === 'object' && direccion ? direccion.port : puerto;
  console.log(`Servidor escuchando en el puerto ${puertoActivo}`);
});

function cerrarServidor() {
  servidor.close((error) => {
    if (error) {
      console.error(error);
      process.exitCode = 1;
    }
  });
}

process.on('SIGINT', cerrarServidor);
process.on('SIGTERM', cerrarServidor);

