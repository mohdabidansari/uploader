const net = require("net");
const fs = require("fs/promises");
const path = require("path");

const HOST = "::1";
const PORT = 4002;

const clearLine = (dir) => {
  return new Promise((resolve) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

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

  const fileSize = (await fileReadHandle.stat()).size;
  let bytesUploaded = 0;
  let percentUploaded = 0;

  fileStream.on("data", async (data) => {
    const canWriteMore = socket.write(data);

    if (!canWriteMore) {
      fileStream.pause();
    }

    bytesUploaded += data.length;

    let newPercentUploaded = Math.floor((bytesUploaded / fileSize) * 100);

    if (newPercentUploaded !== percentUploaded) {
      console.log(`Uploaded... ${percentUploaded}%`);
      await moveCursor(0, -1);
      await clearLine(0);

      percentUploaded = newPercentUploaded;
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
