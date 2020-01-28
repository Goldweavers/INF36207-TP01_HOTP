const logger = require('./utils/logger')
const { EOL } = require('os')
const figlet = require('figlet')

figlet('tokenizr', (err, data) => {
  if (err) {
    logger.error(`failed to start (${err.message})`)
    return process.exit(1)
  }

  data
    .split(EOL)
    .forEach((line) => logger.info(line))

  require('yargs')
    .commandDir('cmds')
    .demandCommand()
    .help()
    .argv
});
