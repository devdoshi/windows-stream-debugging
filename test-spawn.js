// const execa = require('execa')
const fs = require('fs');
const path = require('path');

const interactions = fs.createReadStream(path.join(__dirname, 'input-interactions-100000.jsonl'));


// const child = execa('./optic_diff.exe', [path.join(__dirname, 'input-events.json')], { input: interactions })
// child.stdout.pipe(process.stdout)
// child.then(() => {
//     console.log('finito')
// })
// .catch((err) => {
//     console.error('error in spawned process', err);
//     throw err;
// })

const DiffEngine = require('@useoptic/diff-engine');

const engine = DiffEngine.spawn({ specPath: path.join(__dirname, 'input-events.json') })

interactions.pipe(engine.input)
engine.output.pipe(process.stdout)
engine.error.pipe(process.stderr);

// interactions.pipe(process.stdout)