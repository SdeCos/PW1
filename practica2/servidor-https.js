const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const { manejador } = require("./servidor");

const credenciales = {
  key: fs.readFileSync(
    path.join(__dirname, "certificados", "clave-servidor.pem"),
  ),
  cert: fs.readFileSync(
    path.join(__dirname, "certificados", "certificado-servidor.pem"),
  ),
};

http
  .createServer((req, res) => {
    res.writeHead(301, { location: "https://localhost:3443" });
    res.end();
  })
  .listen(3000);

https.createServer(credenciales, manejador).listen(3443, () => {
  console.log("HTTPS escuchando en https://localhost:3443");
});
