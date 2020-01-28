const CryptoJS = require('crypto-js')

const config = require('../config/OTP')

/**
 * HMAC-based One-time Password algorithm
 */
class HOTP {
  #token

  /**
   * @param {string} secretKey
   * @param {string} counter
   * @return {number}
   */
  constructor (secretKey, counter) {
    const HmacSHA1 = CryptoJS.HmacSHA1(counter, secretKey)
      .toString(CryptoJS.enc.Hex)

    this.#token = this.truncate(HmacSHA1)
  }

  /**
   * Selects 4 bytes from the result of the HMAC in a defined manner
   * @param {string} HmacSHA1
   * @return {number}
   */
  truncate (HmacSHA1) {
    const offset = parseInt(HmacSHA1[HmacSHA1.length - 1], 16);

    return parseInt(HmacSHA1.substr(offset * 2, 8), 16);
  }

  /**
   * Compare instance token with specified one
   * @param {string} token
   * @return {boolean}
   */
  isEqualTo (token) {
    return token === this.token
  }

  /**
   * Get formatted token
   * @return {string}
   */
  get token () {
    const token = this.#token % Math.pow(10, config.DIGITS)

    return token
      .toString()
      .padStart(config.DIGITS, '0')
  }
}

module.exports = HOTP
