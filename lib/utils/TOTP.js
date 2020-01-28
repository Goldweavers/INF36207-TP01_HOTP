const moment = require('moment')

const HOTP = require('./HOTP')
const config = require('../config/OTP')

/**
 * Time-based One-time Password
 */
class TOTP extends HOTP {
  constructor (secretKey) {
    super(secretKey, TOTP.getCounterNow(config.STEPS))
  }

  /**
   * T = (Current Unix time - T0) / X
   * @param step - Represents the time step in seconds
   * @param T0 - Initial counter time
   * @return {string} T
   */
  static getCounterNow(step = 30, T0 = 0) {
    const currentUnixTime = moment()
      .utc()
      .unix()

    return Math.floor((currentUnixTime - T0) / step)
      .toString(16) // to hex
      .padStart(16, '0')
  }
}

module.exports = TOTP
