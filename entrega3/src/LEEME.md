# Práctica 3 — Cuánto pesa un `npm install`

Programación Web I · Sesión 10 · **Régimen D** · Entrega antes de la sesión 11 (jueves 15 de octubre)

El enunciado completo está en `Practica3-Sesion10-PW1.docx`. Esto es solo el resumen.

## Lo que hay en la carpeta

| Fichero | Qué es |
|---|---|
| `servidor.js` | Una API de productos hecha solo con el módulo `http`. Funciona. Es lo que el asistente va a convertir a Express. |
| `servidor.test.cjs` | 12 tests que arrancan el servidor y le hacen peticiones de verdad. **No se tocan.** |
| `revisar.js` | Hace una radiografía del proyecto: scripts, dependencias y cuántos paquetes trae cada una. No opina: solo mide. |
| `AUDITORIA.md` | La plantilla de lo que entregas. |

## Los pasos

1. `node --test` → **11 en verde y 1 en rojo** (el 6: todavía no hay UUID). Es lo esperado.
2. Pídele a tu asistente **exactamente** el prompt del enunciado. Guarda la conversación entera.
3. Haz **todo** lo que te diga, incluidos sus `npm install`. Después copia `package.json` como `package.asistente.json`.
4. `npm test` y `node revisar.js`. Copia las dos salidas: es la radiografía **antes**.
5. Audita **cada** dependencia: ¿existe?, ¿qué versión se ha instalado?, ¿cuántos paquetes arrastra?, ¿lo hace ya Node o Express?
6. Deja el proyecto con lo mínimo que cumpla los seis requisitos y los 12 tests en verde. `node revisar.js` otra vez: radiografía **después**.

## Comandos que te van a hacer falta

```
npm view <paquete>                 # ¿existe? ¿qué versiones hay? ¿quién lo mantiene?
npm ls --all                       # el árbol entero de node_modules
npm explain <paquete>              # ¿quién ha traído este paquete?
npm audit                          # vulnerabilidades conocidas
node revisar.js                    # la radiografía
```

Necesitas Node 22 o posterior (`node --version`). **No entregues la carpeta `node_modules`.**
