# Programación Web I — Sesión 6

## Montar un servidor HTTPS con certificados propios

Jueves 24 de septiembre de 2026

---

## Antes de empezar

Comprueba que tienes las dos herramientas. En una terminal:

```
node --version
openssl version
```

- **Node** ya lo instalaste en la sesión 4.
- **OpenSSL**: en Linux y macOS viene puesto. En Windows, **Git Bash lo trae**
  (búscalo en el menú de inicio) — es la forma más rápida de tenerlo. Si prefieres
  PowerShell, comprueba que `openssl version` responde antes de clase.

Arranca el servidor de partida para verificar que todo va:

```
node servidor.js
```

y abre `http://localhost:3000`. Tienes que ver la página con su logo y sus
estilos. Si la ves en blanco y negro, algo va mal con el `Content-Type`; avisa.

---

## Lo que hay en esta carpeta

| Fichero                        | Qué es                                                                                                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `servidor.js`                  | El servidor HTTP de la sesión 5, ya corregido: comprueba la ruta, devuelve 404 de verdad y deduce el `Content-Type` de la extensión. **Hoy no vas a tocar esta lógica.** |
| `public/`                      | La página que sirve: `index.html`, `estilos.css`, `logo.svg`.                                                                                                            |
| `certificados/extensiones.cnf` | Las extensiones X.509 que necesita el certificado del servidor. Ya está escrito; léelo, está comentado.                                                                  |
| `solucion/`                    | La solución del taller. **No la abras hasta el minuto 90.**                                                                                                              |
| `.gitignore`                   | Impide que subas las claves privadas a un repositorio. Léelo: explica por qué.                                                                                           |

---

## Paso 1 · Tu primer certificado (autofirmado)

Un comando. Sitúate en la carpeta `certificados/`:

```
cd certificados

openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout clave-servidor.pem -out certificado-servidor.pem \
  -days 30 \
  -subj "/C=ES/O=UNEATLANTICO/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

> En **PowerShell** las barras invertidas al final de línea no valen: escribe todo
> el comando en una sola línea, o usa Git Bash.

Te ha generado dos ficheros, y la diferencia entre ellos es el concepto entero
de la clase:

- `clave-servidor.pem` — la **clave privada**. No sale nunca de esta máquina.
- `certificado-servidor.pem` — el **certificado**. Se lo das a todo el que se conecte.

### Ábrelo por dentro

```
openssl x509 -in certificado-servidor.pem -noout -text
```

Y ahora la versión corta, que es la que importa hoy:

```
openssl x509 -in certificado-servidor.pem -noout -subject -issuer -dates
```

Vas a leer algo así:

```
subject=C = ES, O = UNEATLANTICO, CN = localhost
issuer=C = ES, O = UNEATLANTICO, CN = localhost
notBefore=Sep 24 09:00:00 2026 GMT
notAfter=Oct 24 09:00:00 2026 GMT
```

**`subject` e `issuer` son la misma línea.** Has firmado tu propio carné de
identidad. Por eso se llama autofirmado, y por eso ningún navegador se lo va a creer.

---

## Paso 2 · El servidor HTTPS

Crea `servidor-https.js` al lado de `servidor.js`. La idea: **el manejador de
peticiones no cambia**; solo cambia quién crea el servidor.

```js
const https = require("https");
const fs = require("fs");
const path = require("path");

// El manejador es el mismo de antes. No lo reescribas: impórtalo.
const { manejador } = require("./servidor");

const credenciales = {
  key: fs.readFileSync(
    path.join(__dirname, "certificados", "clave-servidor.pem"),
  ),
  cert: fs.readFileSync(
    path.join(__dirname, "certificados", "certificado-servidor.pem"),
  ),
};

https.createServer(credenciales, manejador).listen(3443, () => {
  console.log("HTTPS escuchando en https://localhost:3443");
});
```

Arráncalo y abre `https://localhost:3443` en el navegador.

**Te va a saltar un aviso a pantalla completa.** No lo esquives todavía: léelo, y
fíjate en el código de error (`NET::ERR_CERT_AUTHORITY_INVALID` en Chrome).
Después acepta el riesgo y entra.

La página se ve, y el texto ha cambiado de rojo a verde: la conexión está
cifrada. Con exactamente la misma criptografía que la de tu banco. Lo que falta
no es cifrado: es que alguien firme por ti.

---

## Paso 3 · Míralo desde fuera

El navegador te lo resume; `openssl` te lo cuenta entero:

```
openssl s_client -connect localhost:3443 -servername localhost
```

Busca cuatro cosas en la parrafada:

1. `New, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384` — qué versión y qué cifrado se acordaron.
2. `subject=` e `issuer=` — otra vez, la misma línea.
3. `Verify return code: 18 (self-signed certificate)` — el veredicto.
4. La cadena de certificados que ha enviado el servidor. Hoy tiene un eslabón.

Con `curl` el mensaje es más corto y más claro:

```
curl https://localhost:3443/
```

```
curl: (60) SSL certificate problem: self-signed certificate
```

> En Windows, dentro de PowerShell, escribe `curl.exe` — `curl` a secas es otra cosa.

---

## Paso 4 · Redirige el HTTP al HTTPS

Un servidor serio no sirve las dos versiones: sirve HTTPS y manda allí a quien
llegue por HTTP. Añade a tu `servidor-https.js`:

```js
const http = require("http");

http
  .createServer((req, res) => {
    res.writeHead(301, { Location: `https://localhost:3443${req.url}` });
    res.end();
  })
  .listen(3000);
```

Compruébalo sin navegador, que el navegador sigue la redirección y no te deja verla:

```
curl -I http://localhost:3000/estilos.css
```

```
HTTP/1.1 301 Moved Permanently
Location: https://localhost:3443/estilos.css
```

Y añade la cabecera HSTS a las respuestas HTTPS:

```js
res.setHeader("Strict-Transport-Security", "max-age=31536000");
```

Le dice al navegador: _«durante un año, con este dominio, ni lo intentes por
HTTP»_. Solo tiene efecto si llega por HTTPS — por eso no sirve de nada ponerla
en el servidor de redirección.

---

## Paso 5 (opcional, si te sobra tiempo) · Sé tu propia autoridad

Aquí es donde se entiende la diferencia entre _cifrado_ y _de fiar_. En vez de
firmarte tú mismo, vas a montar una CA de clase y que sea ella la que te firme.

```
cd certificados

# 1. La CA: su clave y su certificado raíz. Una CA siempre se autofirma;
#    la diferencia es que la suya está en el almacén de tu sistema y la tuya no.
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout ca-clave.pem -out ca-certificado.pem -days 365 \
  -subj "/C=ES/O=CA de clase PW1/CN=CA de clase PW1"

# 2. El servidor pide que le firmen: genera clave + CSR (Certificate Signing Request).
openssl req -newkey rsa:2048 -nodes \
  -keyout clave-servidor.pem -out servidor.csr \
  -subj "/C=ES/O=UNEATLANTICO/CN=localhost"

# 3. La CA firma la petición, añadiendo las extensiones del fichero .cnf.
openssl x509 -req -in servidor.csr \
  -CA ca-certificado.pem -CAkey ca-clave.pem -CAcreateserial \
  -out certificado-servidor.pem -days 30 \
  -extfile extensiones.cnf
```

Mira otra vez quién firma a quién:

```
openssl x509 -in certificado-servidor.pem -noout -subject -issuer
```

```
subject=C = ES, O = UNEATLANTICO, CN = localhost
issuer=C = ES, O = CA de clase PW1, CN = CA de clase PW1
```

Ya no son la misma línea: hay una cadena. Reinicia el servidor y prueba:

```
curl https://localhost:3443/
curl --cacert certificados/ca-certificado.pem https://localhost:3443/
```

El primero falla — y **falla con otro mensaje que antes**:

```
curl: (60) SSL certificate problem: unable to get local issuer certificate
```

Ya no dice «autofirmado»: dice que no conoce a quien lo firmó. El segundo
funciona, porque le has dicho de quién fiarse.

**Eso es todo lo que hace tu navegador**, solo que la lista de «de quién fiarse»
se la dio el sistema operativo y tiene unos cientos de entradas. Si añades
`ca-certificado.pem` al almacén de tu sistema, el candado te sale limpio: no
porque tu servidor sea más seguro, sino porque has cambiado en quién confías.

---

## Los cuatro comandos que te vas a llevar

| Para qué                      | Comando                                                                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Crear certificado autofirmado | `openssl req -x509 -newkey rsa:2048 -nodes -keyout clave.pem -out cert.pem -days 30 -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost"` |
| Leer un certificado           | `openssl x509 -in cert.pem -noout -text`                                                                                                          |
| Ver quién firma a quién       | `openssl x509 -in cert.pem -noout -subject -issuer -dates`                                                                                        |
| Mirar un servidor por fuera   | `openssl s_client -connect localhost:3443 -servername localhost`                                                                                  |

---

## Aviso

Los certificados de esta carpeta son **para tu portátil y para esta clase**. No
sirven para nada en internet: nadie los reconoce. Cuando montes algo de verdad,
lo que se usa es una CA pública —Let's Encrypt es gratuita y automática— y la
renovación la hace un programa, no tú. Desde marzo de 2026 un certificado
público no puede durar más de 200 días, en marzo de 2027 serán 100, y en 2029, 47. Renovar a mano dejó de ser una opción.
