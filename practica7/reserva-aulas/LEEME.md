# reserva-aulas · Sesión 18 · Programación Web I

Una carpeta por punto de control. Cada una es el proyecto completo tal como queda al final de ese paso.

| Carpeta | Qué tiene |
|---|---|
| `paso-0` | El punto de partida: la solución del jueves (sesión 17, paso 5) |
| `paso-1` | ✓1 · Registro: `POST /api/registro`, la clave guardada como `sal:hash` (scrypt) |
| `paso-2` | ✓2 · Login: `POST /api/login` devuelve un token (JWT) |
| `paso-3` | ✓3 · `requiereLogin`: sin token, no se crean, cambian ni borran aulas (401) |
| `paso-4` | ✓4 · `/entrar` y `/salir` desde la página, con el token en una cookie |
| `paso-5` | ✓5 · Solo quien creó un aula puede borrarla (403) |

¿Te has perdido? Copia la carpeta del último ✓ que te funcionó, ábrela en VS Code y, en la terminal:

```
npm install
npm start
```

Hoy entran dos dependencias nuevas: `jsonwebtoken` (desde paso-2) y `cookie-parser` (desde paso-4). `npm install` las instala.

Necesitas MongoDB arrancado (Compass conecta a `mongodb://127.0.0.1:27017`) y el puerto 3000 libre.
Los usuarios de clase (`ana@ua.es` / `ana-pw1`, `luis@ua.es` / `luis-pw1`) se crean con las peticiones de registro de `peticiones.http`.
`npm run sembrar` **borra** los usuarios y las aulas que haya.
