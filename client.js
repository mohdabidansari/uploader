const net = require("net");
const fs = require("fs/promises");
const path = require("path");

const HOST = "::1";
const PORT = 4002;

const socket = net.createConnection({ host: HOST, port: PORT }, async () => {
  const filePath = process.argv[2];
  console.log(filePath);
  const fileName = path.basename(filePath);

  if (!filePath) {
    console.log("Enter file path");
    socket.end();
    return;
    // throw new Error("File to be uploaded not specified!");
  }

  socket.write(`fileName: ${fileName}-endoffilename-`);

  const fileReadHandle = await fs.open(filePath, "r");
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
