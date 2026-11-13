# reserva-aulas · Sesión 17 · Programación Web I

Una carpeta por punto de control. Cada una es el proyecto completo tal como queda al final de ese paso.

| Carpeta | Qué tiene |
|---|---|
| `paso-0` | El punto de partida: el CRUD de usuarios del lunes (base de datos `reserva-aulas`) |
| `paso-1` | ✓1 · El modelo `Aula` y la API `/api/aulas` |
| `paso-2` | ✓2 · `GET /aulas`: la página de aulas pintada en el servidor |
| `paso-3` | ✓3 · Con `escaparHTML` |
| `paso-4` | ✓4 · Con un formulario que no necesita JavaScript (y `sembrar.js`) |
| `paso-5` | ✓5 · Con `aulas.js` y `generar.js`: una página estática |

¿Te has perdido? Copia la carpeta del último ✓ que te funcionó, ábrela en VS Code y, en la terminal:

```
npm install
npm start
```

Necesitas MongoDB arrancado (Compass conecta a `mongodb://127.0.0.1:27017`) y el puerto 3000 libre.
`npm run sembrar` (paso-4 y paso-5) **borra** los usuarios y las aulas que haya y crea 200 de cada.
