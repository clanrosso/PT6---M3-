// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];
let id = 0;

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

// TODO: your code to handle requests

server.post("/posts", function (req, res) {
  if (
    typeof req.body.author !== "string" ||
    req.body.author === "" ||
    typeof req.body.title !== "string" ||
    req.body.title === "" ||
    typeof req.body.contents !== "string" ||
    req.body.contents === ""
  ) {
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  }
  let newPost = {
    author: req.body.author,
    title: req.body.title,
    contents: req.body.contents,
    id: id++,
  };
  posts.push(newPost);
  res.json(newPost);
});

server.post("/posts/author/:author", function (req, res) {
  if (
    typeof req.params.author !== "string" ||
    req.params.author === "" ||
    typeof req.body.title !== "string" ||
    req.body.title === "" ||
    typeof req.body.contents !== "string" ||
    req.body.contents === ""
  ) {
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  }
  let newPost = {
    author: req.params.author,
    title: req.body.title,
    contents: req.body.contents,
    id: id++,
  };
  posts.push(newPost);
  res.json(newPost);
});

server.get("/posts", function (req, res) {
  if (typeof req.query.term === "string" || req.query.term !== "") {
    let selectedPosts = posts.filter((p) => {
      return (
        p.title.includes(req.query.term) || p.contents.includes(req.query.term)
      );
    });
    return res.json(selectedPosts);
  }
  res.json(posts);
});

server.get("/posts/:author", function (req, res) {
  if (req.params.author) {
    let selectedPosts = posts.filter((p) => {
      return p.author === req.params.author;
    });
    if (selectedPosts.length === 0) {
      res.status(STATUS_USER_ERROR).json({
        error: "No existe ningun post del autor indicado",
      });
    } else {
      res.json(selectedPosts);
    }
  }
});

server.get("/posts/:author/:title", function (req, res) {
  if (req.params.author && req.params.title) {
    let selectedPosts = posts.filter((p) => {
      return p.author === req.params.author && p.title === req.params.title;
    });
    if (selectedPosts.length === 0) {
      res.status(STATUS_USER_ERROR).json({
        error: "No existe ningun post con dicho titulo y autor indicado",
      });
    } else {
      res.json(selectedPosts);
    }
  }
});

server.put("/posts", (req, res) => {
  const { id, title, contents } = req.body;

  if (!id || !title || !contents)
    return res.status(STATUS_USER_ERROR).json({
      error:
        "No se recibieron los parámetros necesarios para actualizar el Post",
    });

  const post = posts.find((post) => post.id === id);

  if (!post)
    return res.status(STATUS_USER_ERROR).json({
      error: "El id no corresponde con un Post existente",
    });

  post.title = title;
  post.contents = contents;

  return res.json(post);
});

server.delete("/posts", function (req, res) {
  let { id } = req.body;
  if (!id) {
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para eliminar el Post",
    });
  }
  let selectedPost = posts.find((p) => p.id === parseInt(id));
  if (!selectedPost) {
    return res.status(STATUS_USER_ERROR).json({
      error: "No existe Post para ese ID",
    });
  } else {
    posts.splice(posts.indexOf(selectedPost), 1);
  }
  return res.json({ success: true });
});

server.delete("/author", function (req, res) {
  let { author } = req.body;
  if (!author) {
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para eliminar el Post",
    });
  }
  let selectedPosts = posts.filter((p) => p.author === author);
  if (selectedPosts.length === 0) {
    return res.status(STATUS_USER_ERROR).json({
      error: "No existe el autor indicado",
    });
  } else {
    selectedPosts.forEach((p) => {
      posts.splice(posts.indexOf(p), 1);
    });
  }
  return res.json(selectedPosts);
});

module.exports = { posts, server };
