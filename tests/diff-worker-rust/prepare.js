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
  const diffId = "test-diff";
  const outputBaseDir = path.join(captureBaseDirectory, captureId, "diffs");
  const outputDir = path.join(outputBaseDir, diffId);
  if (fs.existsSync(outputBaseDir)) {
    rimraf.sync(outputBaseDir);
  }
  fs.mkdirpSync(path.join(outputDir));
  fs.copySync(path.join(__dirname, "output-base"), outputDir);
  fs.copyFileSync(eventsPath, path.join(outputDir, "events.json"));

  const diffConfig = {
    captureId,
    captureBaseDirectory,
    diffId,
    specFilePath: path.join(outputDir, "events.json"),
    ignoreRequestsFilePath: path.join(outputDir, "ignoreRequests.json"),
    additionalCommandsFilePath: path.join(outputDir, "additionalCommands.json"),
    filtersFilePath: path.join(outputDir, "filters.json"),
  };

  console.log(JSON.stringify(diffConfig));
}

const [, , interactionsPath, eventsPath] = process.argv;
main(interactionsPath, eventsPath);
