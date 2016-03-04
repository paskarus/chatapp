const Console = require('console').Console;
const fs = require('fs');
const output = fs.createWriteStream('./log/stdout.log');
const errorOutput = fs.createWriteStream('./log/stderr.log');

const logger = new Console(output, errorOutput);

module.exports = logger;