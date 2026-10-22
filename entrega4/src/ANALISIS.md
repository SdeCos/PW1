# Práctica 4 — Análisis

**Nombre:** Saul de Cos Sanchez
**Asistente y modelo** (el mismo en las dos rondas): Codex 5.6 Sol
**Versión de Node** (`node --version`): v26.11.1

---

## 1 · Ronda 1: el prompt escueto

Enlace a la conversación, o la conversación exportada entera.
**[Conversacion]()**

> Salida de `node --test`:

```
❯ node --test
✔ 0 · sin dependencias (117.210792ms)
✖ 1 · GET /libros: los cinco, todos disponibles, en JSON (2.125041ms)
✖ 2 · GET /libros/:isbn devuelve ese libro (1.365791ms)
✔ 3 · un ISBN que no existe: 404 con { error } (1.89025ms)
✖ 4 · POST /prestamos: 201, con fechas de inicio y de devolución (2.61975ms)
✖ 5 · un libro prestado ya no está disponible (1.39225ms)
✖ 6 · prestar un libro ya prestado: 409 (1.363375ms)
✔ 7 · faltan datos: 400 (1.662541ms)
✖ 8 · socio o libro que no existen: 404 (0.923583ms)
✖ 9 · como mucho tres préstamos a la vez por socio: el cuarto da 409 (0.761125ms)
✖ 10 · GET /socios/:id/prestamos: los activos del socio (0.559083ms)
✖ 11 · DELETE /prestamos/:id devuelve el libro: 204 (0.586375ms)
✔ 12 · devolver un préstamo que no existe: 404 (0.493083ms)
✔ 13 · una ruta que no existe: 404 (0.401833ms)
ℹ tests 14
ℹ suites 0
ℹ pass 5
ℹ fail 9
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 217.259583

✖ failing tests:

test at servidor.test.cjs:45:1
✖ 1 · GET /libros: los cinco, todos disponibles, en JSON (2.125041ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

  404 !== 200

      at TestContext.<anonymous> (/Users/sauldecos/git/PW1/entrega4/src/servidor.test.cjs:47:10)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1409:7)
      at async Test.processPendingSubtests (node:internal/test_runner/test:974:7) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: 404,
    expected: 200,
    operator: 'strictEqual',
    diff: 'simple'
  }

test at servidor.test.cjs:54:1
✖ 2 · GET /libros/:isbn devuelve ese libro (1.365791ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

  404 !== 200

      at TestContext.<anonymous> (/Users/sauldecos/git/PW1/entrega4/src/servidor.test.cjs:56:10)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1409:7)
      at async Test.processPendingSubtests (node:internal/test_runner/test:974:7) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: 404,
    expected: 200,
    operator: 'strictEqual',
    diff: 'simple'
  }

test at servidor.test.cjs:66:1
✖ 4 · POST /prestamos: 201, con fechas de inicio y de devolución (2.61975ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

  400 !== 201

      at TestContext.<anonymous> (/Users/sauldecos/git/PW1/entrega4/src/servidor.test.cjs:68:10)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1409:7)
      at async Test.processPendingSubtests (node:internal/test_runner/test:974:7) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: 400,
    expected: 201,
    operator: 'strictEqual',
    diff: 'simple'
  }

test at servidor.test.cjs:78:1
✖ 5 · un libro prestado ya no está disponible (1.39225ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  + actual - expected

  + undefined
  - false

      at TestContext.<anonymous> (/Users/sauldecos/git/PW1/entrega4/src/servidor.test.cjs:79:10)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1409:7)
      at async Test.processPendingSubtests (node:internal/test_runner/test:974:7) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: undefined,
    expected: false,
    operator: 'strictEqual',
    diff: 'simple'
  }

test at servidor.test.cjs:82:1
✖ 6 · prestar un libro ya prestado: 409 (1.363375ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

  400 !== 409

      at TestContext.<anonymous> (/Users/sauldecos/git/PW1/entrega4/src/servidor.test.cjs:83:10)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1409:7)
      at async Test.processPendingSubtests (node:internal/test_runner/test:974:7) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: 400,
    expected: 409,
    operator: 'strictEqual',
    diff: 'simple'
  }

test at servidor.test.cjs:91:1
✖ 8 · socio o libro que no existen: 404 (0.923583ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

  400 !== 404

      at TestContext.<anonymous> (/Users/sauldecos/git/PW1/entrega4/src/servidor.test.cjs:92:10)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1409:7)
      at async Test.processPendingSubtests (node:internal/test_runner/test:974:7) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: 400,
    expected: 404,
    operator: 'strictEqual',
    diff: 'simple'
  }

test at servidor.test.cjs:96:1
✖ 9 · como mucho tres préstamos a la vez por socio: el cuarto da 409 (0.761125ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

  400 !== 201

      at TestContext.<anonymous> (/Users/sauldecos/git/PW1/entrega4/src/servidor.test.cjs:97:10)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1409:7)
      at async Test.processPendingSubtests (node:internal/test_runner/test:974:7) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: 400,
    expected: 201,
    operator: 'strictEqual',
    diff: 'simple'
  }

test at servidor.test.cjs:102:1
✖ 10 · GET /socios/:id/prestamos: los activos del socio (0.559083ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

  404 !== 200

      at TestContext.<anonymous> (/Users/sauldecos/git/PW1/entrega4/src/servidor.test.cjs:104:10)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1409:7)
      at async Test.processPendingSubtests (node:internal/test_runner/test:974:7) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: 404,
    expected: 200,
    operator: 'strictEqual',
    diff: 'simple'
  }

test at servidor.test.cjs:109:1
✖ 11 · DELETE /prestamos/:id devuelve el libro: 204 (0.586375ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

  400 !== 204

      at TestContext.<anonymous> (/Users/sauldecos/git/PW1/entrega4/src/servidor.test.cjs:111:10)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1409:7)
      at async Test.processPendingSubtests (node:internal/test_runner/test:974:7) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: 400,
    expected: 204,
    operator: 'strictEqual',
    diff: 'simple'
  }
```

Para cada test en rojo: ¿**no podía saberlo** (la información solo estaba en la especificación) o es **un error suyo** (lo habría hecho mal aunque lo supiera)?

| Test | Qué esperaba                                                 | Qué hizo                 | ¿No podía saberlo o error suyo? ¿Por qué?  |
| ---- | ------------------------------------------------------------ | ------------------------ | ------------------------------------------ |
| 1    | Estado 200 y array JSON                                      | Devolvio 404             | No podia saberlo                           |
| 2    | Estado 200 y JSON del libro                                  | Devolvio 404             | No podia saberlo                           |
| 4    | Estado 201 y el prestamo calculado                           | Devolvio 400             | No podia saberlo                           |
| 5    | Que si se presta un libro, al consultarlo no este disponible | Devuelve valor undefined | No podia saberlo                           |
| 6    | Estado 409                                                   | Devolvio 400             | Falta de especificacion                    |
| 8    | Estado 404                                                   | Devolvio 400             | No podia saberlo + error de especificacion |
| 9    | Estado 201 en los tres primeros y 409 a partir de ahi        | Devolvio 400             | No podia saberlo                           |
| 10   | Estado 200 y array JSON                                      | Devolvio 404             | No podia saberlo                           |
| 11   | Estado 204                                                   | Devolvio 400             | No podia saberlo                           |

¿Te hizo alguna pregunta antes de escribir código? ¿Cuál?
No

## 2 · Ronda 2: diario de turnos

Enlace a la conversación, o la conversación exportada entera.
**[Conversacion](https://chatgpt.com/s/cx_6ada2b9cb0ec819186e493bcb614926d)**

| Turno | Qué le diste (contexto, un paso, un error…)                 | Tests en verde después |
| ----- | ----------------------------------------------------------- | ---------------------- |
| 1     | Prompt indicado en el ejercicio sin ningun tipo de contexto | 5/14                   |
| 2     | Nueva conversacion con contexto y tests                     | 14/14                  |

Si tocaste el código a mano en algún momento, dilo aquí y explica qué y por qué.

## 3 · El requisito sin test

¿Cuál es? ¿Cómo lo has comprobado (curl, navegador…)? ¿Lo cumple la ronda 1? ¿Y la ronda 2?
El que no comprueba es el 9, todos los tests contienen guiones, por lo que no se comprueba, se puede comprobar con curl: curl -i http://localhost:3012/libros/9788400000028, la ronda 1 no lo pasa, mientras que la 2 si que lo hace

## 4 · Qué contexto fue decisivo

Qué parte de lo que le diste cambió más el resultado. Qué le diste que no sirvió para nada. Qué harías distinto la próxima vez.

> Una vez el asistente conoce los tests, que especifican los resultados esperados, lo hace correctamente, ha sido la diferencia decisiva entre ambas rondas

## 5 · Lo que hizo mal aun con contexto

Algo que esté mal, o sea mejorable, en `ronda2/servidor.js` aunque pase los 14 tests. Si no encuentras nada, explica qué miraste.

## 6 · Declaraciones

- **Declaración de autoría:** Declaro que he utilizado Codex como apoyo para proponer la implementación. He revisado el código, comprobado su funcionamiento y entiendo los cambios incluidos en esta entrega.

- **Declaración de uso de IA** (herramienta, finalidad y fase): Codex 5.6, para los prompts indicados en la actividad

```

```
