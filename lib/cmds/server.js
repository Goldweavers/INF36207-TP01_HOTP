const moment = require('moment')
const readline = require('readline')
const logger = require('../utils/logger')
const TOTP = require('../utils/TOTP')

const config = require('../config')

let lastExpiredOTP = null, currentOTP = null

const secToMs = (sec) => moment.duration(sec, 'seconds').asMilliseconds()

module.exports = {
  desc: 'Check if the token supplied matches the locally generated token',
  handler: (arguments) => {
    logger.info('--------------------CONFIGURATION--------------------')
    logger.info(`server: token expiration = ${config.OTP.STEPS} sec`)
    logger.info(`server: token digits = ${config.OTP.DIGITS}`)
    logger.info('-----------------------------------------------------')
    const timeToWait = 60 - moment().seconds()
    const timeout = setTimeout(() => {
      setInterval(updateLastExpiredToken, secToMs(config.OTP.STEPS))
      clearTimeout(timeout)

      logger.info('server: time successfully synchronized')
      return startServer()
    }, secToMs(timeToWait))

    lastExpiredOTP = new TOTP(config.OTP.SECRET)
    logger.info(`server: waiting ${timeToWait} secs for time synchronisation...`)
  },
}

function startServer () {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  })
  let retryCounter = 0

  updateLastExpiredToken()
  rl.on('line', (line) => setImmediate((line) => {
    if (new TOTP(config.OTP.SECRET).isEqualTo(line) === true) {
      logger.info('server: access granted !')
      retryCounter = 0
    } else {
      if (retryCounter >= config.SERVER.MAX_RETRY) {
        logger.error('server: too much retries, exiting...')
        process.exit(0)
      }
      logger.warn('server: access denied (invalid token)')
      retryCounter = retryCounter + 1
    }

    return waitingForInputs()
  }, line))
}

function updateLastExpiredToken () {
  const token = new TOTP(config.OTP.SECRET)

  if (token.isEqualTo(lastExpiredOTP.getToken()) === false) {
    if (currentOTP !== null) {
      lastExpiredOTP = currentOTP
    }
    currentOTP = token
    return waitingForInputs()
  }
}

function waitingForInputs () {
  logger.debug(`server: last expired token was ${lastExpiredOTP.getToken()}`)
  logger.info('server: waiting for token...')
}
