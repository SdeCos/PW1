const http = require("http");

const servidor = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("<h1>Hola desde el modulo http</h1>");
});
servidor.listen(3000, () => console.log("Escuchando en 3000"));
