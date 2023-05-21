const net = require("net");

const HOST = "::1";
const PORT = 4002;

const socket = net.createConnection({ host: HOST, port: PORT }, async () => {
  console.log("Connected to server");
});
