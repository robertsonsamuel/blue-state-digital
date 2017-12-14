import nock from 'nock'
import BSD from '../src'

require('dotenv').config()

// Test of BSD class instance and construction

beforeAll(() => {
  nock(`https://${process.env.BSD_DEV}`)
    .get('/page/api')
    .query(true)
    .reply(404, 'Missing required parameters to determine class and method name')
  nock(`https://${process.env.BSD_DEV}`)
    .get('/page/api')
    .query(true)
    .reply(403, 'API user not recognized')
})

afterAll(() => {
  nock.cleanAll()
})

describe('BSD', () => {
  describe('when all constructor params are correct and present', () => {
    it('should be an instance of the BSD class', () => {
      const blueStateDigital = new BSD({
        baseUrl: process.env.BSD_DEV,
        apiID: process.env.BSD_API_ID,
        apiSecret: process.env.BSD_API_SECRET,
        apiVer: 2,
      })
      expect(blueStateDigital).toBeInstanceOf(BSD)
    })

    it('should authenticate with BSD', async () => {
      const blueStateDigital = new BSD({
        baseUrl: process.env.BSD_DEV,
        apiID: process.env.BSD_API_ID,
        apiSecret: process.env.BSD_API_SECRET,
        apiVer: 2,
      })
      // We expect this 404 missing error this means BSD has authenticated correctly
      // There is no entry point for BSD
      const response = await blueStateDigital.authenticate()
      expect(response).toEqual('Missing required parameters to determine class and method name')
    })
  })

  describe('when constructor params are incorrect', () => {
    it('should throw an argument error when options are missing', () => {
      let blueStateDigital
      expect(() => {
        blueStateDigital = new BSD()
      }).toThrowError('Must provide a BSD configuration object.')
      expect(blueStateDigital).toBeUndefined()
    })

    it('should throw an argument error when the baseUrl is missing', () => {
      let blueStateDigital
      expect(() => {
        blueStateDigital = new BSD({
          apiID: 'MyapiID',
          apiSecret: '43875utihgkfj38563y4uig',
          apiVer: 2,
        })
      }).toThrowError('Must provide a base url.')
      expect(blueStateDigital).toBeUndefined()
    })

    it('should fail authenticate with BSD', async () => {
      const blueStateDigital = new BSD({
        baseUrl: process.env.BSD_DEV,
        apiID: 'badAppID',
        apiSecret: process.env.BSD_API_SECRET,
        apiVer: 2,
      })
      const response = await blueStateDigital.authenticate()
      expect(response).toEqual('API user not recognized')
    })
  })
})
