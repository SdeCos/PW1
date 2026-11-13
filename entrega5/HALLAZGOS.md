# Práctica 5 · Hallazgos

- **Nombre y apellidos:** Saúl de Cos Sánchez
- **Asistente usado (y versión o modelo, si lo sabes):** Codex
- **Dónde lo usaste** (editor, chat del navegador…): App de escritorio de codex
- **Fecha y hora en que pegaste el prompt:** Viernes 13 de Noviembre, 12:36

---

## 1 · Qué hizo el asistente

- **Ficheros que creó o cambió** (todos, también `package.json` y `servidor.js`): aulas/vistas.js, peticiones.http, reservas/api.js, reservas (carpeta completa), servidor.js y paginas.js
- **Qué te preguntó** (literal) y qué contestaste («Decide tú»): Nada
- **Primera pasada de los tests** (sobre su código, sin tocar): 2 de 7 en verde. La salida está en `salida-asistente.txt`.

---

## 2 · Fichas de hallazgo

Una ficha por cada problema. Copia el bloque tantas veces como haga falta.

### Hallazgo 1 · R3 no acepta la reserva válida

|                                                                            |                                                                                               |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Qué pasa**                                                               | Espera `hora`; la especificación envía `franja`. Devuelve 400 en vez de 201.                  |
| **Dónde** (fichero y ruta o función)                                       | `reservas/api.js`, `POST /api/reservas`.                                                      |
| **Requisito que incumple** (R1 … R8, o «ninguno»)                          | R3.                                                                                           |
| **CWE** (número y nombre)                                                  | CWE-20, Improper Input Validation.                                                            |
| **¿En el Top 25 de 2025?** (sí, en qué puesto / no)                        | Sí, puesto 18.                                                                                |
| **Cómo se demuestra** (la petición exacta y la respuesta que da)           | POST válido con `{"aula":"<id>","fecha":"2027-03-15","franja":8}` y token: 400, esperaba 201. |
| **¿Lo detecta un test?** (cuál / ninguno)                                  | Sí, R3.                                                                                       |
| **El arreglo** (qué cambiaste; a mano o con el asistente)                  | Pendiente: aceptar `franja` como entero de 8 a 20.                                            |
| **Cómo sé que está arreglado** (la misma petición, ahora con su respuesta) | Pendiente: repetir el POST y anotar la respuesta real; se espera 201.                         |

### Hallazgo 2 · R5 no llega a comprobar el aula inexistente

|                                                                            |                                                                                                  |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Qué pasa**                                                               | Devuelve 400 antes de comprobar el aula; el test esperaba 404.                                   |
| **Dónde** (fichero y ruta o función)                                       | `reservas/api.js`, validación previa a `Aula.exists`.                                            |
| **Requisito que incumple** (R1 … R8, o «ninguno»)                          | R5 en la ejecución del test; no demuestra por sí solo que falle la comprobación del aula.        |
| **CWE** (número y nombre)                                                  | CWE-20, misma causa que R3.                                                                      |
| **¿En el Top 25 de 2025?** (sí, en qué puesto / no)                        | Sí, puesto 18.                                                                                   |
| **Cómo se demuestra** (la petición exacta y la respuesta que da)           | La salida de R5 indica 400 en vez de 404. El cuerpo exacto no aparece en el txt.                 |
| **¿Lo detecta un test?** (cuál / ninguno)                                  | Sí, R5; se atasca antes del caso de aula inexistente.                                            |
| **El arreglo** (qué cambiaste; a mano o con el asistente)                  | Pendiente: alinear la entrada con `franja`; después verificar que aula inexistente devuelve 404. |
| **Cómo sé que está arreglado** (la misma petición, ahora con su respuesta) | Pendiente: repetir R5 y anotar la respuesta real; se espera 404.                                 |

### Hallazgo 3 · R6 no llega a probar el solape

|                                                                            |                                                                                                           |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Qué pasa**                                                               | La creación inicial responde 400 en vez de 201, así que el test no alcanza la comprobación del duplicado. |
| **Dónde** (fichero y ruta o función)                                       | `reservas/api.js` y el índice de `reservas/modelo.js`.                                                    |
| **Requisito que incumple** (R1 … R8, o «ninguno»)                          | R6 queda sin comprobar; el índice también usa `hora` en vez de `franja`.                                  |
| **CWE** (número y nombre)                                                  | CWE-20, misma causa que R3.                                                                               |
| **¿En el Top 25 de 2025?** (sí, en qué puesto / no)                        | Sí, puesto 18.                                                                                            |
| **Cómo se demuestra** (la petición exacta y la respuesta que da)           | La salida de R6 indica 400 en vez del 201 esperado para la primera reserva.                               |
| **¿Lo detecta un test?** (cuál / ninguno)                                  | Sí, R6; falla durante la preparación.                                                                     |
| **El arreglo** (qué cambiaste; a mano o con el asistente)                  | Pendiente: usar `franja` también en el índice único y volver a probar el duplicado.                       |
| **Cómo sé que está arreglado** (la misma petición, ahora con su respuesta) | Pendiente: comprobar primera reserva 201 y repetida 409.                                                  |

### Hallazgo 4 · R7 no llega a consultar el listado

|                                                                            |                                                                                  |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Qué pasa**                                                               | La petición de preparación falla con 400; el test no alcanza el GET del listado. |
| **Dónde** (fichero y ruta o función)                                       | `reservas/api.js`, creación de reservas.                                         |
| **Requisito que incumple** (R1 … R8, o «ninguno»)                          | R7 queda sin comprobar en esta ejecución.                                        |
| **CWE** (número y nombre)                                                  | CWE-20, misma causa que R3.                                                      |
| **¿En el Top 25 de 2025?** (sí, en qué puesto / no)                        | Sí, puesto 18.                                                                   |
| **Cómo se demuestra** (la petición exacta y la respuesta que da)           | La salida de R7 indica 400 en vez del 201 esperado al preparar la reserva.       |
| **¿Lo detecta un test?** (cuál / ninguno)                                  | Sí, R7; falla antes del GET.                                                     |
| **El arreglo** (qué cambiaste; a mano o con el asistente)                  | Pendiente: corregir el formato de creación y volver a ejecutar el test.          |
| **Cómo sé que está arreglado** (la misma petición, ahora con su respuesta) | Pendiente: comprobar que el GET devuelve 200 y no incluye emails ni claves.      |

### Hallazgo 5 · R8 no llega a probar la anulación

|                                                                            |                                                                                             |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Qué pasa**                                                               | La reserva de preparación responde 400; el test no alcanza las comprobaciones de anulación. |
| **Dónde** (fichero y ruta o función)                                       | `reservas/api.js`, creación de reservas.                                                    |
| **Requisito que incumple** (R1 … R8, o «ninguno»)                          | R8 queda sin comprobar en esta ejecución.                                                   |
| **CWE** (número y nombre)                                                  | CWE-20, misma causa que R3.                                                                 |
| **¿En el Top 25 de 2025?** (sí, en qué puesto / no)                        | Sí, puesto 18.                                                                              |
| **Cómo se demuestra** (la petición exacta y la respuesta que da)           | La salida de R8 indica 400 en vez del 201 esperado al preparar la reserva.                  |
| **¿Lo detecta un test?** (cuál / ninguno)                                  | Sí, R8; falla antes de probar las anulaciones.                                              |
| **El arreglo** (qué cambiaste; a mano o con el asistente)                  | Pendiente: corregir el formato de creación y volver a ejecutar el test.                     |
| **Cómo sé que está arreglado** (la misma petición, ahora con su respuesta) | Pendiente: repetir R8 y anotar los resultados reales: 401, 403, 404 y 204.                  |

---

## 3 · R1, el requisito sin test

¿Hay carpeta `reservas/` con `modelo.js` y `api.js` (un `Router`)? ¿Está montada en `servidor.js` con una línea? ¿Usa el `requiereLogin` de `usuarios/sesion.js` o ha escrito otro? ¿Ha añadido dependencias a `package.json`? Justifica cada respuesta con el código.

---

## 4 · Lo que el asistente hizo bien

Qué partes de su código das por buenas y **por qué estás seguro** (qué has probado).

---

## 5 · Declaraciones

**Declaración de autoría.** Declaro que el análisis de este documento (las fichas de hallazgo, su demostración y sus arreglos) es trabajo mío.

**Declaración de uso de IA (régimen D).**

| Herramienta | Finalidad                                               | Fase       |
| ----------- | ------------------------------------------------------- | ---------- |
| Codex       | Generar el código de las reservas con el prompt literal | Generación |
|             | (si lo usaste también para arreglar algo, dilo aquí)    |            |

Firma y fecha:
