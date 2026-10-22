# Práctica 4 — Del prompt escueto al verde

Programación Web I · Sesión 12 · **Régimen D** · Entrega antes de la sesión 14 (lunes 26 de octubre)

El enunciado completo está en `Practica4-Sesion12-PW1.docx`. Esto es solo el resumen.

## Lo que hay en la carpeta

| Fichero | Qué es |
|---|---|
| `ESPECIFICACION.md` | Lo que tiene que hacer la API. **No se lo enseñes al asistente en la ronda 1.** |
| `servidor.test.cjs` | 14 tests. **No se tocan.** Arrancan `node servidor.js` con `PORT=3312`. |
| `ANALISIS.md` | La plantilla de lo que entregas. |

No hay `servidor.js`: lo escribe el asistente.

## Ronda 1 · Escueto

1. Crea una carpeta **vacía**, `ronda1`, y ábrela **sola** en el editor (o usa un chat del navegador). Si el asistente puede ver `ESPECIFICACION.md` o los tests, ya no es escueto.
2. Conversación **nueva**. Este prompt, literal, sin añadir nada:
   > Hazme con Node.js, sin dependencias, una API REST para gestionar los préstamos de una biblioteca. El fichero principal se llama servidor.js y el puerto se lee de la variable de entorno PORT.
3. Si te pregunta algo, contesta solo: *«Decide tú.»*
4. Cuando termine, copia su `servidor.js` a la carpeta principal y ejecuta allí `node --test`. Copia la salida.

## Ronda 2 · Con contexto

1. Conversación **nueva**. Ahora vale todo lo de la sesión 12: dale la especificación y los tests, divide el trabajo en pasos, y refina pegando el error real.
2. Apunta **cada turno**: qué le diste y cuántos tests quedaban en verde después.
3. Objetivo: **14 en verde**. Guarda el resultado en `ronda2/servidor.js`.

## Y además

Uno de los requisitos de la especificación **no tiene test**. Encuéntralo y compruébalo a mano en las dos rondas.

Necesitas Node 22 o posterior (`node --version`).
