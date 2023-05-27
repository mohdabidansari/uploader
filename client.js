const net = require("net");
const fs = require("fs/promises");

const HOST = "::1";
const PORT = 4002;

const socket = net.createConnection({ host: HOST, port: PORT }, async () => {
  console.log("Connected to server");

  const fileReadHandle = await fs.open(`text-huge.txt`, "r");
  const fileStream = fileReadHandle.createReadStream();

  fileStream.on("data", (data) => {
    const canWriteMore = socket.write(data);

    if (!canWriteMore) {
      fileStream.pause();
    }
  });

  socket.on("drain", () => {
    fileStream.resume();
  });

  fileStream.on("end", () => {
    console.log("File uploaded successfully!");
    socket.end();
  });

  //   socket.
});
