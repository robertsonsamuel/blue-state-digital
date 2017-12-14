// @flow
import Promise from 'bluebird'
import request from 'request'
import crypto from 'crypto'
/**
 * @module utils
 */

export const getRequestPromise = (settings: {
  url?: string,
  method?: string,
  data?: any,
  headers?: any,
  query?: any,
  json?: boolean,
}): Promise => new Promise((resolve, reject) => {
  const requestOptions = {
    url: settings.url,
    qs: settings.query,
    method: settings.method,
    body: settings.data,
    json: settings.json,
    headers: settings.headers,
  }
  request(requestOptions, (err, res, body) => {
    if (err) {
      reject(err)
      return
    }

    resolve(body)
  })
})

export const generateApiMac = (settings: {
  path: string,
  params: string,
  apiID: string,
  apiVer: number,
  apiSecret: string,
  apiTs: number,
  params?: any,
}): string => {
  const signingString: string = `${settings.apiID}\n${settings.apiTs}\n${settings.path}\napi_ver=${
    settings.apiVer
  }&api_id=${settings.apiID}&api_ts=${settings.apiTs}${
    settings.params ? `&${settings.params}` : ''
  }`

  return crypto
    .createHmac('sha1', settings.apiSecret)
    .update(signingString)
    .digest('hex')
}
