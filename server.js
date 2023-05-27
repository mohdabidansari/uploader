const net = require("net");
const fs = require("fs/promises");

const server = net.createServer((socket) => {});

server.on("connection", async (socket) => {
  console.log("New connection!");
  const random = Math.floor(Math.random() * 10);

  const fileWriteHandle = await fs.open(`storage/myfile-${random}.txt`, "w");
  const fileStream = fileWriteHandle.createWriteStream();

  socket.on("data", (data) => {
    const canWriteMore = fileStream.write(data);
    if (!canWriteMore) {
      socket.pause();
    }
  });

  fileStream.on("drain", () => {
    socket.resume();
  });

  socket.on("end", () => {
    fileStream.close();
    fileWriteHandle.close();
    console.log("A connection was closed");
  });
});

server.listen(4002, "::1", () => {
  console.log("Server opened", server.address());
});
