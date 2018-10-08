// @flow
import querystring from 'querystring'
import Promise from 'bluebird'
import { generateApiMac, getRequestPromise } from './utils'

/**
 * Searches all the events and returns the future events unless specified by date_start.
 *
 * REF: https://secure.bluestatedigital.com/page/api/doc (send_triggered_email)
 * @param {object} params The BSD API Options.
 * @param {string} params.mailing_id Obfuscated mailing ID to be sent (found in the BSD cp)
 * @param {string} params.email Recipient email address
 * @param {string} params.email_opt_in Whether to subscribe newly-created constituents
 * @param {string} params.trigger_values Additional data to be made available to the email
 * @returns {Promise} BSD JSON Response Promise
 * @memberof BSD
 */

export default function (params: {
  mailing_id: string,
  email: string,
  email_opt_in: string,
  trigger_values: string
}) {
  return new Promise((resolve, reject) => {
    const timeStamp = Date.now()

    // api mac must be generated without url encoded parameters
    const queryParams = querystring.stringify(params, '&', '=', { encodeURIComponent: str => str })
    const queryParamsEncoded = querystring.stringify(params)

    const apiMac = generateApiMac({
      path: '/page/api/mailer/send_triggered_email',
      params: queryParams.length === 0 ? '' : `${queryParams}`,
      apiID: this.apiID,
      apiVer: this.apiVer,
      apiSecret: this.apiSecret,
      apiTs: timeStamp,
    })

    const body = `api_ver=${this.apiVer}&api_id=${this.apiID}&api_ts=${timeStamp}&api_mac=${apiMac}&${queryParamsEncoded}`

    getRequestPromise({
      url: `${this.baseUrl}/page/api/mailer/send_triggered_email?api_ver=${this.apiVer}&api_id=${this.apiID}&api_ts=${timeStamp}&api_mac=${apiMac}`,
      method: 'POST',
      data: body,
      headers: {
        'User-agent': `node.js/${process.version.replace('v', '')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
