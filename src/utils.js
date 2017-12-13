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
}): any =>
  new Promise((resolve, reject) => {
    const requestOptions = {
      url: settings.url,
      method: settings.method,
      body: settings.data,
      json: typeof settings.data === 'object',
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
  apiID: string,
  apiVer: number,
  apiSecret: string,
  apiTs: number,
  params?: any,
}): string => {
  const signingString: string = `${settings.apiID}\n${settings.apiTs}\n${settings.path}\napi_ver=${
    settings.apiVer
  }&api_id=${settings.apiID}&api_ts=${settings.apiTs}`
  return crypto
    .createHmac('sha1', settings.apiSecret)
    .update(signingString)
    .digest('hex')
}
