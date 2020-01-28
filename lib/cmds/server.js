const moment = require('moment')
const readline = require('readline')
const logger = require('../utils/logger')
const TOTP = require('../utils/TOTP')

const config = require('../config/OTP')

let lastExpiredOTP = new TOTP(config.SECRET)

const secToMs = (sec) => moment.duration(sec, 'seconds').asMilliseconds()

module.exports = {
  desc: 'Check if the token supplied matches the locally generated token',
  handler: (arguments) => {
    logger.info('--------------------CONFIGURATION--------------------')
    logger.info(`server: token expiration = ${config.STEPS} sec`)
    logger.info(`server: token digits = ${config.DIGITS}`)
    logger.info('-----------------------------------------------------')
    const timeToWait = 60 - moment().seconds()
    const timeout = setTimeout(() => {
      setInterval(updateLastExpiredToken, secToMs(config.STEPS))
      clearTimeout(timeout)

      logger.info('server: time successfully synchronized')
      return startServer()
    }, secToMs(timeToWait))

    logger.info(`server: waiting ${timeToWait} secs for time synchronisation...`)
  },
}

function startServer () {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  })

  waitingForInputs()
  rl.on('line', (line) => {
    new TOTP(config.SECRET).isEqualTo(line) === true
      ? logger.info('server: access granted !')
      : logger.error('server: access denied !')

    return waitingForInputs()
  })
}

function updateLastExpiredToken () {
  const token = new TOTP(config.SECRET)

  if (token.isEqualTo(lastExpiredOTP.token) === false) {
    waitingForInputs()
    lastExpiredOTP = token
  }
}

function waitingForInputs () {
  logger.debug(`server: last expired token was ${lastExpiredOTP.token}`)
  logger.info('server: waiting for token...')
}
