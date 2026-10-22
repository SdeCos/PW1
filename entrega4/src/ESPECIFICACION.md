# API de préstamos de la biblioteca — Especificación

Node.js 22 o posterior. **Sin dependencias**: solo lo que trae Node. Todo en un fichero, `servidor.js`. Los datos viven en memoria: al reiniciar, se pierden.

## R1 · Arranque

- El puerto se lee de la variable de entorno `PORT`. Si no existe, 3012.
- Al arrancar hay estos cinco libros (los ISBN son ficticios) y estos dos socios, y ningún préstamo:

| isbn | titulo | autor |
|---|---|---|
| 978-84-0000-001-1 | Don Quijote de la Mancha | Miguel de Cervantes |
| 978-84-0000-002-8 | La Regenta | Leopoldo Alas «Clarín» |
| 978-84-0000-003-5 | Fortunata y Jacinta | Benito Pérez Galdós |
| 978-84-0000-004-2 | Luces de bohemia | Ramón del Valle-Inclán |
| 978-84-0000-005-9 | Nada | Carmen Laforet |

| id | nombre |
|---|---|
| 1 | Ana |
| 2 | Luis |

## R2 · Formato

- Todas las respuestas con cuerpo son JSON (`Content-Type: application/json`).
- Los errores tienen la forma `{ "error": "texto que explica el problema" }`.
- Una ruta que no existe responde 404.

## R3 · `GET /libros`

Los cinco libros, cada uno con sus tres campos y uno más: `disponible` (`true` si no está prestado).

## R4 · `GET /libros/:isbn`

Ese libro, con `disponible`. Si no existe, 404.

## R5 · `POST /prestamos`

Cuerpo: `{ "isbn": "978-84-0000-001-1", "socio": 1 }`. `isbn` es texto y `socio` es el id numérico.

Si todo va bien, 201 y el préstamo creado:

```json
{ "id": 1, "isbn": "978-84-0000-001-1", "socio": 1, "inicio": "2026-10-19", "devolucion": "2026-11-02" }
```

- `id`: un número; el primero es 1 y cada préstamo nuevo suma uno.
- `inicio`: la fecha de hoy, `AAAA-MM-DD`, en UTC.
- `devolucion`: 14 días después de `inicio`.

Errores, comprobados en este orden:

1. Falta `isbn` o `socio`, o no son del tipo correcto → **400**.
2. El libro o el socio no existen → **404**.
3. El libro ya está prestado → **409**.
4. El socio ya tiene **3** préstamos activos → **409**.

## R6 · `DELETE /prestamos/:id`

Devuelve el libro: el préstamo desaparece y el libro vuelve a estar disponible. Responde **204**, sin cuerpo. Si el préstamo no existe, 404.

## R7 · `GET /socios/:id/prestamos`

Los préstamos activos de ese socio. Si el socio no existe, 404.

## R8 · Nada más

No hace falta autenticación, ni base de datos, ni página web.

## R9 · ISBN con o sin guiones

En las rutas y en el cuerpo de las peticiones, un ISBN se acepta con guiones o sin ellos: `978-84-0000-002-8` y `9788400000028` son el mismo libro. En las respuestas, siempre con guiones.
