import nock from 'nock'
import path from 'path'
import fs from 'fs'

import BSD from './../../src'

require('dotenv').config()

beforeAll(() => {
  nock(`https://${process.env.BSD_DEV}`)
    .get('/page/api/signup/get_form')
    .query(true)
    .reply(200, (uri, requestBody, cb) => {
      fs.readFile(path.resolve(__dirname, '../fixtures/signupForms/signupForm.xml'), cb)
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

describe('#getFormByID()', () => {
  it('should have the property "getFormByID"', () => {
    expect(blueStateDigital).toHaveProperty('getFormByID')
  })

  it('should return all fields for a form', async () => {
    const signupForm = await blueStateDigital.getFormByID({ signup_form_id: '105' })
    expect(signupForm).toBeDefined()
    expect(signupForm).toMatchSnapshot()
  })
})
