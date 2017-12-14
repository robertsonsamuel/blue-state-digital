// @flow

import { ArgumentError } from 'rest-facade'
import util from 'util'
import { getRequestPromise, generateApiMac } from './utils'
import searchEvents from './searchEvents'
import { listForms, listFormFields, getFormByID } from './signupForms'

const BASE_URL_FORMAT = 'https://%s'

/**
 * Create a new BSD rest client.
 *
 * @class BSD
 *
 * @constructor
 *  @example <caption>
 *   The <b>BSD</b> constructor takes a API
 *   ID, if specified it will be used as default value for all endpoints that
 *   accept a API ID. The default is 2 but is required
 *   so you are aware of what version you are using.
 *   </caption>
 *
 *  const blueStateDigital = new BSD({
 *   baseUrl: 'legislator.bsd.net',
 *   apiID: 'MyApiID',
 *   apiSecret: '43875utihgkfj38563y4uig',
 *   apiVer: 2,
 * })
 *
 * @param {object}  options The BSD API Options.
 * @param {String}  options.baseUrl The base url of your bsd instance. IE: https://XYZ
 * @param {String}  options.apiID The App ID for your BSD API Secret.
 * @param {String}  options.apiSecret The API Secret for your BSD API App.
 * @param {Number}  options.apiVer The API version, default is 2 and 2 is only supported for now.
 */

class BSD {
  baseUrl: string
  apiID: string
  apiSecret: string
  apiVer: number = 2

  constructor(options: any) {
    if (!options) {
      throw new ArgumentError('Must provide a BSD configuration object.')
    }

    if (!options.baseUrl || options.baseUrl.length === 0) {
      throw new ArgumentError('Must provide a base url.')
    }

    if (!options.apiID || typeof options.apiID !== 'string') {
      throw new ArgumentError('Must provide an App ID. ')
    }

    if (!options.apiSecret || typeof options.apiSecret !== 'string') {
      throw new ArgumentError('Must provide an api secret. ')
    }

    if (!options.apiVer || typeof options.apiVer !== 'number') {
      throw new ArgumentError('Must provide an api version number 1 or 2.')
    }

    this.baseUrl = util.format(BASE_URL_FORMAT, options.baseUrl)
    this.apiID = options.apiID
    this.apiSecret = options.apiSecret
    this.apiVer = options.apiVer
  }

  /**
   *
   *
   * @returns {string} Returns authentication response
   * @memberof BSD
   */
  async authenticate() {
    const timeStamp = Date.now()
    const apiMac = generateApiMac({
      path: '/page/api',
      apiID: this.apiID,
      apiVer: this.apiVer,
      apiSecret: this.apiSecret,
      apiTs: timeStamp,
    })

    const authResponse = await getRequestPromise({
      url: `${this.baseUrl}/page/api?api_ver=${this.apiVer}&api_id=${
        this.apiID
      }&api_ts=${timeStamp}&api_mac=${apiMac}`,
      method: 'GET',
      headers: {
        'User-agent': `node.js/${process.version.replace('v', '')}`,
        'Content-Type': 'application/json',
      },
    })
    return authResponse
  }

  searchEvents = searchEvents
  listForms = listForms
  listFormFields = listFormFields
  getFormByID = getFormByID
}

module.exports = BSD
