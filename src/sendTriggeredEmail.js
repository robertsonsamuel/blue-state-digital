// @flow
import querystring from 'querystring'
import Promise from 'bluebird'
import { generateApiMac, getRequestPromise } from './utils'

/**
 * Searches all the events and returns the future events unless specified by date_start.
 *
 * REF: https://secure.bluestatedigital.com/page/api/doc#-------------Event-API-Calls---------
 * @param {object} params The BSD API Options.
 * @param {string} params.event_id Search by Event ID
 * @param {string} params.event_type Search by Event Type
 * @param {string} params.host_name Search by the Host of the Event
 * @param {string} params.day Search by the day of the Event
 * @param {string} params.date_start Search by the start date of the Event
 * @param {string} params.date_end Search by the end date of the Event
 * @param {string} params.create_day Search by the created day of the Event
 * @param {string} params.create_date_start Search by the created start date of the Event
 * @param {string} params.create_date_end Search by the created end date of the Event
 * @param {string} params.country Search by events country
 * @param {string} params.zip Search by events zipcode
 * @param {string} params.city Search by events by city
 * @param {string} params.state Search events by state
 * @param {string} params.zip_radius Search events in a given zipcode radius
 * @param {string} params.radius_unit Search events in a given radius
 * @param {string} params.attendee_cons_id Search events by a consituent's ID who is attending
 * @param {string} params.creator_cons_id Search events by the consituent that created the Event
 * @param {string} params.order_field Search events by order field
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
