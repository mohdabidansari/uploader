const net = require("net");
const fs = require("fs/promises");

const server = net.createServer((socket) => {});

server.on("connection", async (socket) => {
  console.log("New connection!");

  let fileWriteHandle, fileStream;

  socket.on("data", async (data) => {
    if (!fileWriteHandle) {
      //Receiving data first time
      socket.pause();

      const fileNameDivider = data.indexOf("-endoffilename-");
      const fileName = data.subarray(10, fileNameDivider).toString("utf-8");

      fileWriteHandle = await fs.open(`storage/${fileName}`, "w");
      fileStream = fileWriteHandle.createWriteStream();

      fileStream.write(data.subarray(fileNameDivider + 15));
      socket.resume();
      fileStream.on("drain", () => {
        socket.resume();
      });
    } else {
      const canWriteMore = fileStream.write(data);
      if (!canWriteMore) {
        socket.pause();
      }
    }
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
