const {
  CaptureSaver,
} = require("@useoptic/cli-shared/build/captures/avro/file-system/capture-saver.js");
const path = require("path");
const fs = require("fs-extra");
const readline = require("readline");
const rimraf = require("rimraf");
const { FileSystemAvroCaptureLoader } = require("@useoptic/cli-shared");

async function main(interactionsPath, eventsPath) {
  if (!interactionsPath)
    throw new Error("interactions path required as first argument");
  if (!eventsPath) throw new Error("events path required as second argument");

  // prepare capture
  const captureBaseDirectory = __dirname;
  const captureId = "capture";

  const interactions = fs.createReadStream(interactionsPath);

  const captureSaver = new CaptureSaver({
    captureBaseDirectory,
    captureId,
  });
  await captureSaver.init();

  const interactionLines = readline.createInterface({
    input: interactions,
    crlfDelay: Infinity,
  });

  for await (let interactionLine of interactionLines) {
    let [interaction] = JSON.parse(interactionLine);
    captureSaver.save(interaction);
  }

  // prepare output
  const outputDir = path.join(__dirname, "output");
  if (fs.existsSync(outputDir)) {
    rimraf.sync(outputDir);
  }
  fs.copySync(path.join(__dirname, "output-base"), outputDir);

  const diffId = ("" + Date.now()).substr(5);

  const diffConfig = {
    captureId,
    captureBaseDirectory,
    diffId,
    specFilePath: eventsPath,
    ignoreRequestsFilePath: path.join(outputDir, "ignoreRequests.json"),
    additionalCommandsFilePath: path.join(outputDir, "additionalCommands.json"),
    filtersFilePath: path.join(outputDir, "filters.json"),
  };

  console.log(JSON.stringify(diffConfig));
}

const [, , interactionsPath, eventsPath] = process.argv;
main(interactionsPath, eventsPath);
