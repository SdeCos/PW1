# Práctica 5 · Especificación de las reservas

> **No se la des al asistente.** Es con lo que vas a comparar lo que él haga.

Una reserva es: un **aula**, un **usuario**, una **fecha** y una **franja**.

| Campo     | Qué es                                                                           |
| --------- | -------------------------------------------------------------------------------- |
| `aula`    | El `_id` de un aula que existe                                                   |
| `usuario` | El `_id` de quien reserva. Lo pone el servidor: es el del token                  |
| `fecha`   | Un texto `AAAA-MM-DD` de un día que existe (`2027-03-15`)                        |
| `franja`  | Un número entero de 8 a 20: la hora a la que empieza. Cada reserva dura una hora |

## Los ocho requisitos

|        | Requisito                                                                                                                                                                                                                                                                                                         | Se comprueba      |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| **R1** | **Estructura.** Una carpeta `reservas/` con `modelo.js` y `api.js` (un `Router`), montada en `servidor.js` con una línea. Usa el `requiereLogin` que ya existe en `usuarios/sesion.js`: no escribe otro. No añade dependencias a `package.json`.                                                                  | Leyendo el código |
| **R2** | **Hay que haber entrado.** `POST /api/reservas` sin token, o con un token malo, responde **401** y no crea nada.                                                                                                                                                                                                  | Test              |
| **R3** | **Reservas a tu nombre.** Con token y datos buenos, `POST /api/reservas` responde **201** con la reserva. Su `usuario` es el del token: si en el cuerpo llega otro `usuario`, no cuenta.                                                                                                                          | Test              |
| **R4** | **Datos malos, 400.** Falta un campo; la fecha no es `AAAA-MM-DD` o es un día que no existe (`2027-02-30`); la franja no es un entero de 8 a 20; el `_id` del aula está mal escrito; o llega un objeto donde se esperaba un texto o un número (`{ "$ne": null }`). En todos los casos, **400** y no se crea nada. | Test              |
| **R5** | **El aula existe.** Un `_id` bien escrito de un aula que no existe: **404**.                                                                                                                                                                                                                                      | Test              |
| **R6** | **Sin solapes.** Si esa aula ya está reservada ese día a esa hora (por quien sea), **409**.                                                                                                                                                                                                                       | Test              |
| **R7** | **Ver sin enseñar de más.** `GET /api/reservas` responde **200** con la lista de reservas. En la respuesta no aparece el email ni la clave de ningún usuario.                                                                                                                                                     | Test              |
| **R8** | **Anular solo las tuyas.** `DELETE /api/reservas/:id`: sin token, **401**; la reserva es de otro, **403**; no existe, **404**; es tuya, **204**.                                                                                                                                                                  | Test              |

Ocho requisitos, siete tests. **R1 no lo comprueba ningún test:** solo se ve leyendo.

## Cómo se pasan los tests

1. Cuando el asistente termine (y hayas guardado la copia sin tocar), copia `pruebas/practica5.test.cjs` dentro de `reserva-aulas/`.
2. Con MongoDB arrancado, el fichero `.env` hecho y **tu servidor parado** (el test arranca el suyo): `node --test practica5.test.cjs`.
