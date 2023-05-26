const net = require("net");
const fs = require("fs/promises");

const server = net.createServer((socket) => {});

server.on("connection", async (socket) => {
  console.log("New connection!");

  const fileWriteHandle = await fs.open(`storage/myfile.txt`, "w");
  const fileStream = fileWriteHandle.createWriteStream();

  socket.on("data", (data) => {
    fileStream.write(data);
  });

  socket.on("end", () => {
    fileStream.close();
    fileWriteHandle.close();
  });
});

server.listen(4002, "::1", () => {
  console.log("Server opened", server.address());
});
