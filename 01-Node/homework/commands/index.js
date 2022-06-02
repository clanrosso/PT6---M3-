var fs = require("fs");
var request = require("request");

module.exports = {
  date: (args, print) => {
    print(Date());
  },
  pwd: (args, print) => {
    print(process.cwd());
  },
  echo: (args, print) => {
    print(args.join(" "));
  },
  cat: (args, print) => {
    fs.readFile(args[0], "utf8", function (err, data) {
      if (err) throw err;
      print(data);
    });
  },
  head: (args, print) => {
    fs.readFile(args[0], "utf8", function (err, data) {
      if (err) throw err;
      print(data.split("\n").splice(0, args[1]).join("\n"));
    });
  },
  tail: (args, print) => {
    fs.readFile(args[0], "utf8", function (err, data) {
      if (err) throw err;
      print(data.split("\n").splice(-args[1]).join("\n"));
    });
  },
  curl: (args, print) => {
    request(args[0], function (err, data) {
      if (err) throw err;
      print(data.body);
    });
  },
  ls: (args, print) => {
    fs.readdir(".", function (err, files) {
      if (err) throw err;
      print(files.join("\n"));
    });
  },
};
