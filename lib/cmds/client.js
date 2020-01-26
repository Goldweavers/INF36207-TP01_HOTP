const logger = require('../utils/logger')

module.exports = {
  command: 'client',
  desc: 'Generate time-limited token',
  handler: (argv) => {
    logger.info('Starting up the HOTP client')
  },
}
