# Práctica 2 — Modernizar sin romper

Programación Web I · Sesión 7 · Régimen D · Entrega antes de la sesión 9 (lunes 5 de octubre)

El enunciado completo está en `Practica2-Sesion07-PW1.docx`. Esto es solo el resumen.

## Lo que hay en la carpeta

| Fichero | Qué es |
|---|---|
| `inventario.js` | Un módulo de 2012. Funciona. Es lo que vas a modernizar. |
| `inventario.test.js` | 14 tests. **No se tocan.** |

## Los pasos

1. `node --test` → tienen que salir **14 en verde**.
2. Copia `inventario.js` como `inventario.original.js`.
3. Pídele a tu asistente, **exactamente**: *«Moderniza este fichero a JavaScript moderno (ES2015 o posterior).»*
   Guarda el prompt, el código que te devuelva y qué asistente y modelo usaste.
4. Pega su código en `inventario.js` y ejecuta `node --test` otra vez. Copia la salida.
5. Compara los dos ficheros (VS Code / Antigravity: clic derecho → *Seleccionar para comparar*, y en el otro → *Comparar con seleccionado*). Mete cada cambio en una de tres cajas: **correcto**, **rompe algo** o **cambia algo que nadie ve**.
6. Arréglalo hasta tener 14 en verde, sin tocar los tests.

Necesitas Node 20 o posterior (`node --version`).
