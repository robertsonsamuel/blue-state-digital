import nock from 'nock'

import { getRequestPromise, generateApiMac } from '../src/utils'

beforeAll(() => {
  nock('https://www.test.com')
    .get('/')
    .reply(200, 'Reply')

  nock('https://www.test.com')
    .get('/')
    .replyWithError('Bad Error')

  nock('https://www.test.com')
    .get('/')
    .query({ foo: 'bar', arrayOfThings: [1, 2, 4] })
    .reply(200, 'Reply')
})

afterAll(() => {
  nock.cleanAll()
})

describe('generateApiMac()', () => {
  it('should generate a valid api mac', () => {
    const apiMac = generateApiMac({
      path: '/page/api/event/search_events',
      appID: 'MyApp',
      apiVer: 2,
      apiSecret: '345jhgkfdg5438hgerklgdfjk',
    })
    expect(apiMac).toEqual(expect.stringMatching(/^[0-9a-f]{40}$/))
  })
})

describe('getRequestPromise()', () => {
  it('should return a request promise that resolves', async () => {
    const requestPromise = getRequestPromise({
      url: 'https://www.test.com',
      method: 'GET',
      json: false,
    })
    await expect(requestPromise).resolves.toBe('Reply')
  })

  it('should reject when there is an error', async () => {
    const response = getRequestPromise({
      url: 'https://www.test.com',
      method: 'GET',
      json: false,
    })
    await expect(response).rejects.toEqual(new Error('Bad Error'))
  })

  it('should support query strings', async () => {
    const requestPromise = getRequestPromise({
      url: 'https://www.test.com',
      query: { foo: 'bar', arrayOfThings: [1, 2, 4] },
      method: 'GET',
      json: false,
    })
    await expect(requestPromise).resolves.toBe('Reply')
  })
})
