const express = require("express");
const app = express();

app.use(express.json()); // for parsing application/json

app.get("/", (req, res) => {
  res.send({
    message: "hola",
  });
});

app.get("/test", (req, res) => {
  res.send({
    message: "test",
  });
});

app.post("/sum", (req, res) => {
  const { a, b } = req.body;
  if (typeof a !== "number" || typeof b !== "number") {
    return res.sendStatus(400);
  }
  res.send({
    result: a + b,
  });
});

app.post("/product", (req, res) => {
  const { a, b } = req.body;
  if (typeof a !== "number" || typeof b !== "number") {
    return res.sendStatus(400);
  }
  res.send({
    result: a * b,
  });
});

app.post("/sumArray", (req, res) => {
  const { array, num } = req.body;
  if (!Array.isArray(array) || typeof num !== "number") {
    return res.sendStatus(400);
  }

  let sumArray = (array, num) => {
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 1; j < array.length; j++) {
        if (array[i] + array[j] === num) return true;
      }
    }
    return false;
  };
  res.json({
    result: sumArray(array, num),
  });
});

app.post("/numString", (req, res) => {
  const { name } = req.body;
  if (typeof name !== "string" || name === "") {
    return res.sendStatus(400);
  }
  return res.json({
    result: name.length,
  });
});

app.post("/pluck", (req, res) => {
  const { array, propiedad } = req.body;
  if (!Array.isArray(array) || propiedad === "") {
    return res.sendStatus(400);
  }
  let newArray = [];
  array.forEach((p) => {
    newArray.push(p[propiedad]);
  });
  return res.json({
    result: newArray,
  });
});

module.exports = app; // Exportamos app para que supertest session la pueda ejecutar
