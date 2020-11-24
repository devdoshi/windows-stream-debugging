const readline = require('readline')
const { eventLoopUtilization } = require('perf_hooks').performance;
const util = require('util');

async function processByLine(inputStream) {
    const lines = readline.createInterface({
        input: inputStream,
        clrfDelay: Infinity
    })

    console.log(lines)
    
    let counter = 0;

    for await (const line of lines) {
        const elu = eventLoopUtilization();
        console.log(`Reading line ${counter}: ${line.substr(0, 100)}`)
        console.log(`Buffered lines: ${util.inspect(inputStream._readableState)} ${util.inspect(inputStream._writableState)}`)
        counter = counter + 1;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(eventLoopUtilization(elu).utilization)
    }
}

processByLine(process.stdin);