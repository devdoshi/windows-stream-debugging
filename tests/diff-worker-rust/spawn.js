const cp = require("child_process");
const path = require("path");

function main(diffConfig) {
  const modulePath = path.join(
    __dirname,
    "..",
    "..",
    "node_modules",
    "@useoptic",
    "cli-scripts",
    "build",
    "emit-diff-projections-rust.js"
  );
  const child = cp.spawn(process.argv0, [modulePath, diffConfig], {
    windowsHide: true,
    stdio: ["pipe", "inherit", "inherit", "ipc"],
  });

  // child.stdout.pipe(process.stdout);
  // child.stderr.pipe(process.stderr);

  return child;
}

const [, , diffConfig] = process.argv;
main(diffConfig);
