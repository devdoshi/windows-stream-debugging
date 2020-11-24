// const execa = require('execa')
const fs = require("fs");
const path = require("path");

const interactions = fs.createReadStream(
  path.join(__dirname, "..", "..", "input-interactions-100000.jsonl")
);

const DiffEngine = require("@useoptic/diff-engine");

const engine = DiffEngine.spawn({
  specPath: path.join(__dirname, "..", "..", "input-events.json"),
});

interactions.pipe(engine.input);
engine.output.pipe(process.stdout);
engine.error.pipe(process.stderr);
