const CryptoJS = require('crypto-js')

const config = require('../config/OTP')

class HOTP {
  #token

  /**
   * @param {string} secretKey
   * @param {string} counter
   * @return {number}
   */
  constructor (secretKey, counter) {
    const HMAC = CryptoJS.HmacSHA256(secretKey, counter)
      .toString(CryptoJS.enc.Hex)

    this.#token = this.truncate(HMAC) & 0x7FFFFFFF
  }

  /**
   * Selects 4 bytes from the result of the HMAC in a defined manner
   * @param HMAC
   * @return {number}
   */
  truncate (HMAC) {
    const offset = HMAC[HMAC.length - 1] & 0xf;

    return (HMAC[offset] & 0x7f) << 24
      | (HMAC[offset + 1] & 0xff) << 16
      | (HMAC[offset + 2] & 0xff) << 8
      | (HMAC[offset + 3] & 0xff);
  }

  get token () {
    const token = this.#token % Math.pow(10, config.DIGITS)

    return token
      .toString()
      .padStart(config.DIGITS, '0')
  }
}

module.exports = HOTP
