const logger = require('../utils/logger')

module.exports = {
  command: 'server',
  desc: 'Check if the token supplied matches the locally generated token',
  handler: (argv) => {
    logger.info('Starting up the HOTP server')
  }
}
