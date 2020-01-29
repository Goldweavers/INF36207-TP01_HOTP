const moment = require('moment')
const logger = require('../utils/logger')
const TOTP = require('../utils/TOTP')

const config = require('../config')

const secToMs = (sec) => moment.duration(sec, 'seconds').asMilliseconds()

module.exports = {
  desc: 'Generate time-limited token',
  handler: (arguments) => {
    logger.info('--------------------CONFIGURATION--------------------')
    logger.info(`client: token expiration = ${config.OTP.STEPS} sec`)
    logger.info(`client: token digits = ${config.OTP.DIGITS}`)
    logger.info('-----------------------------------------------------')
    const timeToWait = 60 - moment().seconds()
    const timeout = setTimeout(() => {
      setInterval(updateValidToken, secToMs(config.OTP.STEPS))
      clearTimeout(timeout)

      logger.info('client: time successfully synchronized')
      return updateValidToken()
    }, secToMs(timeToWait))

    logger.info(
      `client: waiting ${timeToWait} secs for time synchronisation...`)
  },
}

function updateValidToken () {
  const OTP = new TOTP(config.OTP.SECRET)

  const getNewTimer = (sec) => {
    const timeToWait = config.OTP.STEPS / 4
    const timeout = setTimeout(() => {
      const newTimer = sec - timeToWait
      clearTimeout(timeout)

      if (newTimer > 0) {
        logger.info(`client: token still valid for ${newTimer} secs`)
        return getNewTimer(newTimer)
      }
    }, secToMs(timeToWait))
  }
  getNewTimer(config.OTP.STEPS)
  logger.info(`client: generated new token (${OTP.getToken()})`)
}
