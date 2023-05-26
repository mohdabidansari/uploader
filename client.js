const net = require("net");
const fs = require("fs/promises");

const HOST = "::1";
const PORT = 4002;

const socket = net.createConnection({ host: HOST, port: PORT }, async () => {
  console.log("Connected to server");

  const fileReadHandle = await fs.open(`file-to-be-read.txt`, "r");
  const fileStream = fileReadHandle.createReadStream();

  fileStream.on("data", (data) => {
    socket.write(data);
  });

  fileStream.on("end", () => {
    console.log("File uploaded successfully!");
    socket.end();
  });

  //   socket.
});
