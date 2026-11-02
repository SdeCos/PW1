# usuarios-crud · Sesión 16

Un CRUD de usuarios con Express, Mongoose y una página con un formulario.

Cada carpeta es un **punto de control**: el proyecto tal como queda al final de ese paso.

| Carpeta | Qué tiene |
|---|---|
| `paso-1` | Un servidor con Express que responde «hola» |
| `paso-2` | Conexión con MongoDB, el modelo `Usuario` y CREAR (`POST /api/usuarios`) |
| `paso-3` | LEER todos y LEER uno (`GET /api/usuarios` y `GET /api/usuarios/:id`) |
| `paso-4` | ACTUALIZAR y BORRAR (`PUT` y `DELETE /api/usuarios/:id`): la API completa |
| `paso-5` | La página: ver la lista y crear usuarios con el formulario |
| `paso-6` | La página: editar y borrar. El CRUD completo |

## ¿Te has perdido?

1. Copia la carpeta del último punto de control que te funcionó (por ejemplo, `paso-3`).
2. Ábrela en VS Code (Archivo → Abrir carpeta) y abre la terminal (Ctrl+ñ).
3. `npm install` (las carpetas no traen `node_modules`).
4. `npm start` y sigue con el grupo.

Necesitas MongoDB arrancado en `127.0.0.1:27017` (Compass tiene que conectar).

## Probar la API

Abre `peticiones.http` con la extensión **REST Client** de VS Code y pulsa «Send Request» encima de cada petición.
