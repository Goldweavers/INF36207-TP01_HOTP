const moment = require('moment')
const logger = require('../utils/logger')
const TOTP = require('../utils/TOTP')

const config = require('../config/OTP')

const secToMs = (sec) => moment.duration(sec, 'seconds').asMilliseconds()

module.exports = {
  desc: 'Generate time-limited token',
  handler: (arguments) => {
    logger.info('--------------------CONFIGURATION--------------------')
    logger.info(`client: token expiration = ${config.STEPS} sec`)
    logger.info(`client: token digits = ${config.DIGITS}`)
    logger.info('-----------------------------------------------------')
    const timeToWait = 60 - moment().seconds()
    const timeout = setTimeout(() => {
      setInterval(updateValidToken, secToMs(config.STEPS))
      clearTimeout(timeout)

      logger.info('client: time successfully synchronized')
      return updateValidToken()
    }, secToMs(timeToWait))

    logger.info(
      `client: waiting ${timeToWait} secs for time synchronisation...`)
  },
}

function updateValidToken () {
  const OTP = new TOTP(config.SECRET)

  const getNewTimer = (sec) => {
    const timeout = setTimeout(() => {
      const newTimer = sec - (config.STEPS / 4)
      clearTimeout(timeout)

      if (newTimer > 0) {
        logger.info(`client: token still valid for ${newTimer} secs`)
        return getNewTimer(newTimer)
      }
    }, secToMs(config.STEPS / 4))
  }
  getNewTimer(config.STEPS)
  logger.info(`client: generated new token (${OTP.getToken()})`)
}
