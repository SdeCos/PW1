[32m✔ 1 · GET /productos devuelve los tres productos iniciales, en JSON [90m(116.855584ms)[39m[39m
[32m✔ 2 · GET /productos/:id devuelve ese producto [90m(1.919541ms)[39m[39m
[32m✔ 3 · un producto que no existe da 404 [90m(0.717875ms)[39m[39m
[32m✔ 4 · una ruta que no existe da 404 [90m(0.708834ms)[39m[39m
[32m✔ 5 · POST /productos crea un producto y luego se puede pedir [90m(5.689625ms)[39m[39m
[32m✔ 6 · el id de un producto nuevo es un UUID [90m(1.149625ms)[39m[39m
[32m✔ 7 · dos productos nuevos no comparten id [90m(1.565417ms)[39m[39m
[32m✔ 8 · sin nombre, o con nombre vacío, da 400 [90m(1.104792ms)[39m[39m
[32m✔ 9 · precio cero o negativo da 400 [90m(1.09725ms)[39m[39m
[32m✔ 10 · el precio tiene que ser un número, no un texto [90m(0.63575ms)[39m[39m
[32m✔ 11 · un cuerpo que no es JSON da 400 [90m(0.985875ms)[39m[39m
[32m✔ 12 · los productos inválidos no se guardan [90m(2.030708ms)[39m[39m
[34mℹ tests 12[39m
[34mℹ suites 0[39m
[34mℹ pass 12[39m
[34mℹ fail 0[39m
[34mℹ cancelled 0[39m
[34mℹ skipped 0[39m
[34mℹ todo 0[39m
[34mℹ duration_ms 215.341875[39m
Radiografía de api-productos@1.0.0
============================================================

Scripts
  npm run start    →  node servidor.js
  npm run dev      →  nodemon servidor.js
  npm run test     →  echo "Aquí se ejecutarían los tests..." && exit 0

Dependencias (3)
  dotenv                 ^16.4.5     instalada 18.0.6    → 1 paquete(s)
  express                ^4.21.1     instalada 5.2.1     → 68 paquete(s)
  uuid                   ^11.0.0     instalada 14.0.2    → 1 paquete(s)

Dependencias de desarrollo (1)
  nodemon                ^3.1.7      instalada 3.1.14    → 29 paquete(s)

Total
  En este sistema, node_modules tiene 97 paquete(s).
  .gitignore excluye node_modules: NO

## 6. Radiografía después

Comprobación del 09/10/2026 con Node v26.10.0. Las salidas anteriores se conservan como evidencia del estado previo. La salida de 12 tests anterior corresponde a una ejecución directa de los tests: el antiguo script `npm test` solo imprimía un mensaje.

### Sustituciones realizadas

| Dependencia retirada | Sustitución |
|---|---|
| `dotenv` | `process.loadEnvFile()`, con `.env` opcional. |
| `uuid` | `randomUUID()` de `node:crypto`. |
| `nodemon` | `node --watch servidor.js` en el script `dev`. |

Queda `express` como única dependencia directa. Se ha alineado el rango declarado `^5.2.1` con Express 5.2.1 instalado y se ha corregido el script `test` para ejecutar `node --test`. El logger se ejecuta antes del analizador JSON y el precio debe ser un número finito mayor que cero. Se han creado `.gitignore` y `.env.ejemplo`.

### Salida de npm test

```text
> api-productos@1.0.0 test
> node --test

✔ 1 · GET /productos devuelve los tres productos iniciales, en JSON (115.664417ms)
✔ 2 · GET /productos/:id devuelve ese producto (2.169667ms)
✔ 3 · un producto que no existe da 404 (0.758042ms)
✔ 4 · una ruta que no existe da 404 (0.726458ms)
✔ 5 · POST /productos crea un producto y luego se puede pedir (5.608542ms)
✔ 6 · el id de un producto nuevo es un UUID (1.126667ms)
✔ 7 · dos productos nuevos no comparten id (1.571583ms)
✔ 8 · sin nombre, o con nombre vacío, da 400 (1.050667ms)
✔ 9 · precio cero o negativo da 400 (0.9965ms)
✔ 10 · el precio tiene que ser un número, no un texto (0.6485ms)
✔ 11 · un cuerpo que no es JSON da 400 (0.864375ms)
✔ 12 · los productos inválidos no se guardan (2.149667ms)
ℹ tests 12
ℹ suites 0
ℹ pass 12
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 215.6075
```

### Salida de node revisar.js

```text
Radiografía de api-productos@1.0.0
============================================================

Scripts
  npm run start    →  node servidor.js
  npm run dev      →  node --watch servidor.js
  npm run test     →  node --test

Dependencias (1)
  express                ^5.2.1      instalada 5.2.1     → 68 paquete(s)

Dependencias de desarrollo (0)
  — ninguna —

Total
  En este sistema, node_modules tiene 68 paquete(s).
  .gitignore excluye node_modules: sí
```

El recuento pasa de **97 a 68 paquetes**, una reducción de **29 (29,9 %)**. Los 68 incluyen Express y sus dependencias transitivas. `npm ls --all` termina correctamente, sin versiones inválidas; `npm audit` informa de **0 vulnerabilidades** en esta consulta.

### Demostración de los seis requisitos

Las pruebas de `.env` y reinicio se realizaron sobre una copia temporal del código final. Se han conservado intactos el `.env` real, `package.asistente.json` y `servidor.test.cjs`, comprobando sus hashes.

| Requisito | Resultado observado |
|---|---|
| UUID | POST válido devuelve 201 con UUID v4 `003f51d8-6677-4a92-b050-373167648bad`. |
| Puerto configurable | `.env` temporal con `PORT=50657`: el servidor responde en ese puerto. Un `PORT=50660` heredado prevalece sobre el fichero. |
| Reinicio automático | `npm run dev` muestra `Restarting 'servidor.js'` al guardar un cambio en la copia y vuelve a responder. |
| Registro de peticiones | Las 8 peticiones POST, incluido el JSON inválido, aparecen con fecha y hora; por ejemplo, `[09/10/2026 13:19:37] POST /productos`. |
| Validación | Siete POST inválidos devuelven 400 y no se guardan: JSON incorrecto, nombre ausente o vacío, precio cero, negativo, texto o no finito (`1e400`). |
| Tests con npm test | 12 tests correctos, 0 fallos, sin modificar el fichero de tests. |

Este apartado documenta el paso 6. La auditoría completa aún debe organizarse en sus siete apartados e incorporar la tabla, la trazabilidad y las declaraciones requeridas.
