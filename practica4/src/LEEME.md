# Programación Web I — Sesión 9 · Taller en clase

Lunes 5 de octubre de 2026 · **Régimen A: sin IA** · No se entrega

## Qué hay que hacer

`servidor.js` es un servidor con una sola ruta, `/rapido`, que responde enseguida. Vas a añadirle dos rutas que tardan 3 segundos cada una y a medir cómo afectan a `/rapido`.

1. **Escribe la ruta `/lento`.** Un bucle que no hace nada hasta que pasen 3000 ms. Luego responde `lento`.
   Pista: `Date.now()` devuelve la hora actual en milisegundos.
2. **Mide.** Arranca el servidor en una terminal:
   ```
   node servidor.js
   ```
   Y en otra terminal, dentro de la misma carpeta:
   ```
   node medir.js lento
   ```
   Apunta cuánto tarda `/rapido`.
3. **Escribe la ruta `/espera`.** Los mismos 3000 ms, pero con `setTimeout`. Cuando pasen, responde `espera`.
   Reinicia el servidor: `Ctrl+C` y otra vez `node servidor.js`. Node no ve tus cambios hasta que lo reinicias.
4. **Mide otra vez y explícalo.**
   ```
   node medir.js espera
   ```
   Escribe una frase: ¿por qué `/rapido` tarda tan distinto en las dos mediciones?

## Qué hace medir.js

Pide la ruta lenta y, 200 ms después, pide `/rapido`. Luego te dice cuánto ha tardado cada una. No hace falta que lo toques.

## Si algo falla

| Ves esto | Qué pasa |
|---|---|
| `«no existe»` | La ruta aún no está escrita, o no has reiniciado el servidor después de guardar. |
| `no hay servidor escuchando` | El servidor no está arrancado, o se ha parado por un error. Mira su terminal. |
| `EADDRINUSE` | Ya hay otro servidor en el puerto 3009. Ciérralo con `Ctrl+C`. |

## Régimen A

Sin asistente, sin chat y sin autocompletado con IA. Son unas seis líneas de código: lo importante no es escribirlas, es ver el número y saber explicarlo. No se entrega ni hay nota.

## Si terminas pronto

- En `/lento`, cambia el bucle por `require('fs').readFileSync(__filename)` repetido 200 000 veces dentro de un `for`. ¿Bloquea?
- Pon `console.log(this)` y `console.log(arguments.length)` en la primera línea de `servidor.js`. ¿Qué sale, y por qué?
