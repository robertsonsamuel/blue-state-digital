import nock from 'nock'
import path from 'path'
import fs from 'fs'

import BSD from './../../src'

require('dotenv').config()

beforeAll(() => {
  nock(`https://${process.env.BSD_DEV}`)
    .get('/page/api/signup/list_forms')
    .query(true)
    .reply(200, (uri, requestBody, cb) => {
      fs.readFile(path.resolve(__dirname, '../fixtures/signupForms/signupForms.xml'), cb)
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

describe('#listForms()', () => {
  it('should have the property "listForms"', () => {
    expect(blueStateDigital).toHaveProperty('listForms')
  })

  it('should return all forms', async () => {
    const signupForms = await blueStateDigital.listForms()
    expect(signupForms).toBeDefined()
    expect(signupForms).toMatchSnapshot()
  })
})
