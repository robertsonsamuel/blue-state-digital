// @flow
import querystring from 'querystring'
import Promise from 'bluebird'
import { generateApiMac, getRequestPromise } from './utils'

/**
 * This method lists all signup forms and relevant data about those forms.
 * https://secure.bluestatedigital.com/page/api/doc#---------------------list_forms-----------------0.7883351277818669
 * No Params
 *
 * @example
 * const forms = await blueStateDigital.listForms()
 *
 * @returns {Promise} BSD XML Response
 * @memberof BSD
 */
export function listForms() {
  return new Promise((resolve, reject) => {
    const timeStamp = Date.now()
    const apiMac = generateApiMac({
      path: '/page/api/signup/list_forms',
      apiID: this.apiID,
      apiVer: this.apiVer,
      apiSecret: this.apiSecret,
      apiTs: timeStamp,
    })

    getRequestPromise({
      url: `${this.baseUrl}/page/api/signup/list_forms?api_ver=${this.apiVer}&api_id=${
        this.apiID
      }&api_ts=${timeStamp}&api_mac=${apiMac}`,
      method: 'GET',
      json: true,
      headers: {
        'User-agent': `node.js/${process.version.replace('v', '')}`,
        'Content-Type': 'application/json',
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

/**
 * This method gets all properties of the specified signup form.
 * https://secure.bluestatedigital.com/page/api/doc#---------------------get_form-----------------
 *
 * @example
 * const form = await blueStateDigital.getFormByID({ signup_form_id: '105' })
 *
 * @param {object} params Params Object
 * @param {string} params.signup_form_id BSD Form ID
 * @returns {Promise} BSD XML Response Promise
 * @memberof BSD
 */

export function getFormByID(params: { signup_form_id: string }) {
  return new Promise((resolve, reject) => {
    const timeStamp = Date.now()
    const queryParams = querystring.stringify(params)
    const apiMac = generateApiMac({
      path: '/page/api/signup/get_form',
      params: queryParams.length === 0 ? '' : `${queryParams}`,
      apiID: this.apiID,
      apiVer: this.apiVer,
      apiSecret: this.apiSecret,
      apiTs: timeStamp,
    })

    getRequestPromise({
      url: `${this.baseUrl}/page/api/signup/get_form?api_ver=${this.apiVer}&api_id=${
        this.apiID
      }&api_ts=${timeStamp}&api_mac=${apiMac}`,
      method: 'GET',
      query: params,
      json: true,
      headers: {
        'User-agent': `node.js/${process.version.replace('v', '')}`,
        'Content-Type': 'application/json',
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

/**
 * Retrieves a list of all form fields associated with a specified signup form.
 *
 * https://secure.bluestatedigital.com/page/api/doc#---------------------list_form_fields-----------------
 *
 * @example
 * const formFields = await blueStateDigital.listFormFields({ signup_form_id: '105' })
 *
 * @param {object} params Params Object
 * @param {string} params.signup_form_id BSD Form ID
 * @returns {Promise} BSD XML Response Promise
 * @memberof BSD
 */

export function listFormFields(params: { signup_form_id: string }) {
  return new Promise((resolve, reject) => {
    const timeStamp = Date.now()
    const queryParams = querystring.stringify(params)
    const apiMac = generateApiMac({
      path: '/page/api/signup/list_form_fields',
      params: queryParams.length === 0 ? '' : `${queryParams}`,
      apiID: this.apiID,
      apiVer: this.apiVer,
      apiSecret: this.apiSecret,
      apiTs: timeStamp,
    })

    getRequestPromise({
      url: `${this.baseUrl}/page/api/signup/list_form_fields?api_ver=${this.apiVer}&api_id=${
        this.apiID
      }&api_ts=${timeStamp}&api_mac=${apiMac}`,
      method: 'GET',
      query: params,
      json: true,
      headers: {
        'User-agent': `node.js/${process.version.replace('v', '')}`,
        'Content-Type': 'application/json',
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
