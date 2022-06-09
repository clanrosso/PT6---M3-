var fs = require("fs");
var http = require("http");

// Escribí acá tu servidor
http
  .createServer(function (req, res) {
    fs.readFile(__dirname + "/images" + req.url + ".jpg", (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Hubo un error");
      } else {
        res.writeHead(200, { "Content-Type": "image/jpg" });
        res.end(data);
      }
    });
  })
  .listen(1337, "127.0.0.1");
