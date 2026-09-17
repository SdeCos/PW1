const http = require("http");
const servidor = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end('<h1>Portada</h1><a href="/acerca">Acerca de</a>');
  } else if (req.url === "/acerca") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Acerca de</h1>");
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1>404 - Esto no existe</h1>");
  }
});
servidor.listen(3000, () => console.log("Escuchando en 3000"));
