import nock from 'nock'
import path from 'path'
import queryString from 'querystring'
import fs from 'fs'
import BSD from './../../src/index'

require('dotenv').config()

beforeAll(() => {
  nock(`https://${process.env.BSD_DEV}`)
    .get('/page/api/')
    .query(true)
    .reply(404, (uri, requestBody, cb) => {
      cb(null, 'Missing required parameters to determine class and method name')
    })

  nock(`https://${process.env.BSD_DEV}`)
    .get('/page/api/event/search_events')
    .query(true)
    .reply(200, (uri, requestBody, cb) => {
      fs.readFile(path.resolve(__dirname, '../fixtures/events/searchEvents.json'), cb)
    })

  nock(`https://${process.env.BSD_DEV}`)
    .get('/page/api/example')
    .query(true)
    .reply(200, (uri, requestBody, cb) => {
      cb(null, uri)
    })
})

const blueStateDigital = new BSD({
  baseUrl: process.env.BSD_DEV,
  apiID: process.env.BSD_API_ID,
  apiSecret: process.env.BSD_API_SECRET,
  apiVer: 2,
})

describe('#request()', () => {
  it('should have the property "request"', () => {
    expect(blueStateDigital).toHaveProperty('request')
  })

  it('should create a get request and return 404', async () => {
    const response = blueStateDigital.request({
      method: 'GET',
      path: '/page/api/',
    })
    const repsonseBody = await response
    expect(repsonseBody).toBeDefined()
    await expect(repsonseBody).toEqual('Missing required parameters to determine class and method name')
  })

  it('should get all events /page/api/event/search_events', async () => {
    const response = blueStateDigital.request({
      method: 'GET',
      path: '/page/api/event/search_events',
    })
    const repsonseBody = await response
    expect(repsonseBody).toBeDefined()
    expect(repsonseBody).toMatchSnapshot()
  })

  it('should match with the query', async () => {
    const response = blueStateDigital.request({
      method: 'GET',
      path: '/page/api/example',
      query: {
        foo: 'bar',
        ids: '1,3,5',
      },
    })
    const repsonseBody = await response
    expect(repsonseBody).toBeDefined()

    const qs = repsonseBody.substr(repsonseBody.indexOf('?') + 1);
    const query = queryString.parse(qs)
    expect(query.api_ver).toBeDefined()
    expect(query.ids).toEqual('1,3,5')
    expect(query.api_id).toBeDefined()
    expect(query.api_mac).toBeDefined()
  })
})
