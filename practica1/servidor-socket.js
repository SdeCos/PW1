const net = require("net");

const servidor = net.createServer((socket) => {
  socket.on("data", (datos) => {
    console.log(datos.toString());

    socket.write("HTTP/1.1 200 OK \r\n");
    socket.write("Content-Type: text/html\r\n");
    socket.write("\r\n");
    socket.write("<h1>Test desde un socket</h1>");
    socket.end();
  });
});
servidor.listen(3000, () => console.log("Escuchando en 3000"));
