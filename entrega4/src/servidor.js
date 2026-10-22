'use strict';

const http = require('node:http');

const puerto = obtenerPuerto(process.env.PORT);

const libros = [
  {
    isbn: '978-84-0000-001-1',
    titulo: 'Don Quijote de la Mancha',
    autor: 'Miguel de Cervantes',
  },
  {
    isbn: '978-84-0000-002-8',
    titulo: 'La Regenta',
    autor: 'Leopoldo Alas «Clarín»',
  },
  {
    isbn: '978-84-0000-003-5',
    titulo: 'Fortunata y Jacinta',
    autor: 'Benito Pérez Galdós',
  },
  {
    isbn: '978-84-0000-004-2',
    titulo: 'Luces de bohemia',
    autor: 'Ramón del Valle-Inclán',
  },
  {
    isbn: '978-84-0000-005-9',
    titulo: 'Nada',
    autor: 'Carmen Laforet',
  },
];

const socios = new Map([
  [1, { id: 1, nombre: 'Ana' }],
  [2, { id: 2, nombre: 'Luis' }],
]);

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

  if (metodo === 'GET' && partes.length === 1 && partes[0] === 'libros') {
    enviarJson(respuesta, 200, libros.map(libroConDisponibilidad));
    return;
  }

  if (metodo === 'GET' && partes.length === 2 && partes[0] === 'libros') {
    const libro = buscarLibro(partes[1]);
    if (!libro) throw new ErrorHttp(404, 'Libro no encontrado');

    enviarJson(respuesta, 200, libroConDisponibilidad(libro));
    return;
  }

  if (metodo === 'POST' && partes.length === 1 && partes[0] === 'prestamos') {
    const datos = await leerJson(peticion);
    validarDatosPrestamo(datos);

    const libro = buscarLibro(datos.isbn);
    const socio = socios.get(datos.socio);
    if (!libro) throw new ErrorHttp(404, 'Libro no encontrado');
    if (!socio) throw new ErrorHttp(404, 'Socio no encontrado');

    if (!estaDisponible(libro.isbn)) {
      throw new ErrorHttp(409, 'El libro ya esta prestado');
    }

    const prestamosDelSocio = [...prestamos.values()].filter(
      (prestamo) => prestamo.socio === socio.id,
    );
    if (prestamosDelSocio.length >= 3) {
      throw new ErrorHttp(409, 'El socio ya tiene tres prestamos activos');
    }

    const inicio = fechaActual();
    const prestamo = {
      id: siguienteId++,
      isbn: libro.isbn,
      socio: socio.id,
      inicio,
      devolucion: sumarDias(inicio, 14),
    };

    prestamos.set(prestamo.id, prestamo);
    enviarJson(respuesta, 201, prestamo, { Location: `/prestamos/${prestamo.id}` });
    return;
  }

  if (
    metodo === 'GET' &&
    partes.length === 3 &&
    partes[0] === 'socios' &&
    partes[2] === 'prestamos'
  ) {
    const socioId = convertirId(partes[1]);
    if (!socios.has(socioId)) throw new ErrorHttp(404, 'Socio no encontrado');

    const activos = [...prestamos.values()].filter(
      (prestamo) => prestamo.socio === socioId,
    );
    enviarJson(respuesta, 200, activos);
    return;
  }

  if (metodo === 'DELETE' && partes.length === 2 && partes[0] === 'prestamos') {
    const prestamoId = convertirId(partes[1]);
    if (!prestamos.has(prestamoId)) {
      throw new ErrorHttp(404, 'Prestamo no encontrado');
    }

    prestamos.delete(prestamoId);
    respuesta.writeHead(204);
    respuesta.end();
    return;
  }

  throw new ErrorHttp(404, 'Ruta no encontrada');
}

function validarDatosPrestamo(datos) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    throw new ErrorHttp(400, 'El cuerpo debe ser un objeto JSON');
  }

  if (typeof datos.isbn !== 'string' || datos.isbn.trim() === '') {
    throw new ErrorHttp(400, 'isbn es obligatorio y debe ser texto');
  }

  if (!Number.isSafeInteger(datos.socio) || datos.socio < 1) {
    throw new ErrorHttp(400, 'socio es obligatorio y debe ser un id numerico');
  }
}

function buscarLibro(isbn) {
  const normalizado = normalizarIsbn(isbn);
  return libros.find((libro) => normalizarIsbn(libro.isbn) === normalizado);
}

function normalizarIsbn(isbn) {
  return String(isbn).replaceAll('-', '');
}

function estaDisponible(isbn) {
  const normalizado = normalizarIsbn(isbn);
  return ![...prestamos.values()].some(
    (prestamo) => normalizarIsbn(prestamo.isbn) === normalizado,
  );
}

function libroConDisponibilidad(libro) {
  return { ...libro, disponible: estaDisponible(libro.isbn) };
}

function convertirId(valor) {
  const id = Number(valor);
  return Number.isSafeInteger(id) && id > 0 ? id : Number.NaN;
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
  if (valor === undefined || valor === '') return 3012;

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

function sumarDias(fecha, dias) {
  const resultado = new Date(`${fecha}T00:00:00.000Z`);
  resultado.setUTCDate(resultado.getUTCDate() + dias);
  return resultado.toISOString().slice(0, 10);
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
