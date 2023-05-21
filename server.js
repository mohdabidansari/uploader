const net = require("net");

const server = net.createServer((socket) => {});

server.on("connection", () => {
  console.log("New connection!");
});

server.listen(4002, "::1", () => {
  console.log("Server opened", server.address());
});
