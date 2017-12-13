import { generateApiMac } from '../src/utils'

describe('generateApiMac', () => {
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
