/**
 * Configuration for One-time Password
 * @type {{DIGITS: number, SECRET: string, STEPS: number}}
 */
module.exports = {
  /**
   * How many time token remain valid in seconds
   * @type number
   */
  STEPS: 30,

  /**
   * Secret key shared by client & server
   * @type string
   */
  SECRET: 'EVA8H43PXSMQDGVLXSP2PH4ZZ2H2YQXQ',

  /**
   * Length of the generated token
   * @type number
   */
  DIGITS: 8
}
