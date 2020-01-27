const logger = require('../utils/logger')
const TOTP = require('../utils/TOTP')
const config = require('../config/OTP')

module.exports = {
  desc: 'Generate time-limited token',
  handler: (arguments) => {
    logger.info('--------------------CONFIGURATION--------------------')
    logger.info(`client: token expiration: ${config.STEPS} sec`)
    logger.info(`client: token digits: ${config.DIGITS}`)
    logger.info('-----------------------------------------------------')

    clientHandler()
    setInterval(clientHandler, config.STEPS * 1000)
  },
}

function clientHandler () {
  const OTP = new TOTP(config.SECRET)

  logger.info(`client: generated new token: ${OTP.token}`)
}
