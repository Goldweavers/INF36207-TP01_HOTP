const moment = require('moment')

const HOTP = require('./HOTP')
const config = require('../config/OTP')

class TOTP {
  #hotp

  constructor (secretKey) {
    const counter = this.getCounterNow(config.STEPS)
      .toString(16) // to hex
      .padStart(16, '0')

    this.#hotp = new HOTP(secretKey, counter);
  }

  /**
   * T = (Current Unix time - T0) / X
   * @param step - represents the time step in seconds
   * @param T0 - the initial counter time
   * @return {number} T
   */
  getCounterNow(step = 30, T0 = 0) {
    const currentUnixTime = moment().unix()

    return Math.floor((currentUnixTime - T0) / step)
  }

  compare (token) {
    return token === this.#hotp.token
  }

  get token() {
    return this.#hotp.token
  }
}

module.exports = TOTP
