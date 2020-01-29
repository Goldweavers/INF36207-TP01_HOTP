const logger = require('./utils/logger')
const figlet = require('figlet')

const config = require('./config')

figlet(config.APP.NAME, (err, data) => {
  if (err) {
    logger.error(`failed to start (${err.message})`)
    return process.exit(err.code || 1)
  }

  data
    .split('\n')
    .forEach((line) => logger.info(line))

  require('yargs')
    .commandDir('cmds')
    .demandCommand()
    .help()
    .argv
});
