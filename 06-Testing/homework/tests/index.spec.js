const session = require("supertest-session");
const app = require("../index.js"); // Importo el archivo de entrada del server de express.

const agent = session(app);

describe("Test de APIS", () => {
  describe("GET /", () => {
    it("responds with 200", () => agent.get("/").expect(200));
    it("responds with and object with message `hola`", () =>
      agent.get("/").then((res) => {
        expect(res.body.message).toEqual("hola");
      }));
  });

  describe("GET /test", () => {
    it("responds with 200", () => agent.get("/test").expect(200));
    it("responds with and object with message `test`", () =>
      agent.get("/test").then((res) => {
        expect(res.body.message).toEqual("test");
      }));
  });

  describe("POST /sum", () => {
    it("responds with 200", () =>
      agent.post("/sum").send({ a: 1, b: 1 }).expect(200));
    it("responds with 400", () =>
      agent.post("/sum").send({ a: 1, b: "hola" }).expect(400));
    it("responds with the sum of 2 and 3", () =>
      agent
        .post("/sum")
        .send({ a: 2, b: 3 })
        .then((res) => {
          expect(res.body.result).toEqual(5);
        }));
  });

  describe("POST /product", () => {
    it("responds with 200", () =>
      agent.post("/product").send({ a: 1, b: 1 }).expect(200));
    it("responds with 400", () =>
      agent.post("/sum").send({ a: 1, b: "hola" }).expect(400));
    it("responds with the product of 2 and 3", () =>
      agent
        .post("/product")
        .send({ a: 2, b: 3 })
        .then((res) => {
          expect(res.body.result).toEqual(6);
        }));
  });

  describe("POST /sumArray", () => {
    it("responds with 400", () => agent.post("/sumArray").expect(400));
    it("responds with 200", () =>
      agent.post("/sumArray").send({ array: [], num: 0 }).expect(200));
    it("responds with true", () =>
      agent
        .post("/sumArray")
        .send({ array: [2, 5, 7, 10, 11, 15, 20], num: 13 })
        .then((res) => {
          expect(res.body.result).toEqual(true);
        }));
    it("responds with false", () =>
      agent
        .post("/sumArray")
        .send({ array: [2, 5, 7, 10, 11, 15, 20], num: 23 })
        .then((res) => {
          expect(res.body.result).toEqual(false);
        }));
  });

  describe("POST /pluck", () => {
    it("responds with 200", () =>
      agent
        .post("/pluck")
        .send({ array: [{}, {}], propiedad: "nombre" })
        .expect(200));
    it("responds with 400", () =>
      agent
        .post("/pluck")
        .send({ array: "hola", propiedad: "nombre" })
        .expect(400));
    it("responds with 400", () =>
      agent
        .post("/pluck")
        .send({ array: [{}, {}], propiedad: "" })
        .expect(400));
    it("responds with true", () =>
      agent
        .post("/pluck")
        .send({
          array: [
            { nombre: "claudio", apellido: "rosso" },
            { nombre: "melina", apellido: "leiva" },
          ],
          propiedad: "nombre",
        })
        .then((res) => {
          expect(res.body.result).toEqual(["claudio", "melina"]);
        }));
  });

  describe("post /numString", () => {
    it("responds with 400", () =>
      agent.post("/numString").send({ name: "" }).expect(400));
    it("responds with 400", () =>
      agent.post("/numString").send({ name: 5 }).expect(400));
    it("responds with 200", () =>
      agent.post("/numString").send({ name: "melina" }).expect(200));
    it("responds with true", () =>
      agent
        .post("/numString")
        .send({ name: "hola" })
        .then((res) => {
          expect(res.body.result).toEqual(4);
        }));
  });
});
