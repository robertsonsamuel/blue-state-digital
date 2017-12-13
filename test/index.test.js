import BSD from '../src'

require('dotenv').config()

// Test of BSD class instance and construction

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

    it('should authenticate with BSD', (done) => {
      const blueStateDigital = new BSD({
        baseUrl: process.env.BSD_DEV,
        apiID: process.env.BSD_API_ID,
        apiSecret: process.env.BSD_API_SECRET,
        apiVer: 2,
      })
      // We expect this 404 missing error this means BSD has authenticated correctly
      // There is no entry point for BSD
      blueStateDigital.authenticate().then((body) => {
        expect(body).toEqual('Missing required parameters to determine class and method name')
        done()
      })
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
  })
})
