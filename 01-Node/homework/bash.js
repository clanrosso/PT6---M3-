//console.log(Object.keys(process));

const commands = require("./commands/index.js");

var print = (output) => {
  process.stdout.write(output);
  process.stdout.write("\nprompt > ");
};

// Output un prompt
process.stdout.write("prompt > ");
// El evento stdin 'data' se dispara cuando el user escribe una línea
process.stdin.on("data", function (data) {
  var args = data.toString().trim().split(" ");
  var cmd = args.shift();

  if (commands[cmd]) {
    commands[cmd](args, print);
  } else {
    print("cmd not found");
  }
});
