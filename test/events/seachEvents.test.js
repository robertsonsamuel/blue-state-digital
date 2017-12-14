import nock from 'nock'
import path from 'path'
import fs from 'fs'
import BSD from './../../src'

require('dotenv').config()

beforeAll(() => {
  nock(`https://${process.env.BSD_DEV}`)
    .get('/page/api/event/search_events')
    .query(true)
    .reply(200, (uri, requestBody, cb) => {
      fs.readFile(path.resolve(__dirname, '../fixtures/events/searchEvents.json'), cb)
    })

  nock(`https://${process.env.BSD_DEV}`)
    .get('/page/api/event/search_events')
    .query(true)
    .reply(200, (uri, requestBody, cb) => {
      fs.readFile(path.resolve(__dirname, '../fixtures/events/searchEvents.json'), cb)
    })
})

afterAll(() => {
  nock.cleanAll()
})

const blueStateDigital = new BSD({
  baseUrl: process.env.BSD_DEV,
  apiID: process.env.BSD_API_ID,
  apiSecret: process.env.BSD_API_SECRET,
  apiVer: 2,
})

describe('#searchAllEvents()', () => {
  it('should have the property "searchEvents"', () => {
    expect(blueStateDigital).toHaveProperty('searchEvents')
  })

  it('should return all past and future events', async () => {
    const events = await blueStateDigital.searchEvents()
    expect(events).toBeDefined()
    expect(events).toMatchSnapshot()
  })

  it('should return one event by the event id', async () => {
    const event = await blueStateDigital.searchEvents({ event_id: '457' })
    expect(event).toBeDefined()
    expect(event).toHaveLength(1)
    expect(event).toMatchSnapshot()
  })
})
