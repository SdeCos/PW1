# Practica 3 Saul de Cos Sanchez

## Auditoria

| Paquete                | Pedida → instalada   | ¿Para qué?                    | ¿Existe? · descargas/semana · última versión | Arrastra | ¿Ya lo hace Node o Express?                      | Veredicto          |
| ---------------------- | -------------------- | ----------------------------- | -------------------------------------------- | -------: | ------------------------------------------------ | ------------------ |
| `express`              | `^4.21.1` → `5.2.1`  | Crear la API con Express.     | Sí · 140.990.120 · 5.2.1 (01/12/2025).       |       68 | Node tiene HTTP, pero la práctica exige Express. | **Imprescindible** |
| `dotenv`               | `^16.4.5` → `18.0.6` | Leer el puerto desde `.env`.  | Sí · 187.582.080 · 18.0.6 (06/10/2026).      |        1 | Sí: `process.loadEnvFile()`.                     | **Sustituible**    |
| `uuid`                 | `^11.0.0` → `14.0.2` | Generar UUID para productos.  | Sí · 293.519.729 · 14.0.2 (18/08/2026).      |        1 | Sí: `randomUUID()` de `node:crypto`.             | **Sustituible**    |
| `nodemon` (desarrollo) | `^3.1.7` → `3.1.14`  | Reiniciar al guardar cambios. | Sí · 13.369.115 · 3.1.14 (20/02/2026).       |       29 | Sí: `node --watch servidor.js`.                  | **Sustituible**    |

## Prompt

```
Tengo esta API hecha con el módulo http de Node (te pego servidor.js). Conviértela en un proyecto npm
que use Express, con su package.json. Además:
1. Cada producto nuevo tiene que llevar como id un identificador único universal (UUID), no un número.
2. El puerto tiene que poder configurarse en un fichero .env.
3. Mientras desarrollo, quiero que el servidor se reinicie solo cada vez que guardo un fichero.
4. Cada petición tiene que escribirse en la consola con la fecha y la hora en formato dd/mm/aaaa
hh:mm:ss.
5. Valida bien los datos que llegan en el POST.
6. Quiero lanzar los tests con npm test.
El fichero principal tiene que seguir llamándose servidor.js, porque los tests lo arrancan así.
```

## Declaraciones

### Autoría

Declaro que he utilizado Codex como apoyo para proponer la implementación. He revisado el código, comprobado su funcionamiento y entiendo los cambios incluidos en esta entrega.

### Uso IA

| IA Utilizada      | Uso en esta entrega                                                      |
| ----------------- | ------------------------------------------------------------------------ |
| Codex (Terra 5.6) | Prompt indicado en el enunciado y ayuda rellenando la tabla de auditoria |
