// @flow
import request from 'request'
import Promise from 'bluebird'
import querystring from 'querystring'
import { generateApiMac } from './utils'

/**
 * This is the main method to handle easy authentication with bsd and node js.
 * API Base Documentation
 * https://secure.bluestatedigital.com/page/api/doc
 * @example
 * async function doRequest() {
 *   try {
 *     const response = await blueStateDigital.request({
 *       method: '|GET|POST|PUT|DELETE|',
 *       path: 'path for the call, see BSD documentation for possible calls',
 *       body: //body parameters as JSON or an XML string
 *       query: {
 *        // query string parameters, {event_id:2, ids:'1,3,5' } is valid for example
 *       },
 *     })
 *   } catch(err) {
 *     // handle error
 *   }
 * }
 *
 *
 * const response = blueStateDigital.request({
 *   method: '|GET|POST|PUT|DELETE|',
 *   path: 'path for the call, see BSD documentation for possible calls',
 *   body: // //body parameters as JSON or an XML string
 *   query: {
 *    // query string parameters, {event_id: 2 ids:'1,3,5' } is valid for example
 *   },
 * }).then(resp => {
 *   // bsd response
 * })
 * .catch(err => {
 *   // be sure to handle errors
 * })
 *
 * @param {object} options Options Object
 * @param {string} options.method |'GET'|'POST'|'PUT'|'DELETE'|
 * @param {string} options.path BSD API Path /page/api/ or /page/api/events/search_events
 * @param {any} options.body Post Body. {string} XML or {string} JSON
 * @param {object} options.query Query Params
 * @returns {Promise} BSD Response Promise
 * @memberof BSD
 */

export default function (options: { method: string, path: string, body: any, query: any }) {
  return new Promise((resolve, reject) => {
    if (!options) {
      reject(new Error('No request options given'))
    }

    const method = options.method || 'GET'
    const { body, query } = options

    // api mac must be generated without url encoded parameters
    const qs = querystring.stringify(query, '&', '=', { encodeURIComponent: str => str })

    const timeStamp = Date.now()
    const apiMac = generateApiMac({
      path: options.path,
      apiID: this.apiID,
      apiVer: this.apiVer,
      apiSecret: this.apiSecret,
      apiTs: timeStamp,
      params: qs,
    })

    const requestOptions = {
      method,
      url: this.baseUrl + options.path,
      body,
      qs: Object.assign({
        api_ver: this.apiVer,
        api_id: this.apiID,
        api_ts: timeStamp,
        api_mac: apiMac,
      }, query || {}),
      headers: {
        'User-agent': `node.js/${process.version.replace('v', '')}`,
      },
    }

    request(requestOptions, (err, res, respBody) => {
      if (err) {
        reject(err)
        return
      }

      resolve(respBody)
    })
  })
}
