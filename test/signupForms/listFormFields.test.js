import nock from 'nock'
import path from 'path'
import fs from 'fs'

import BSD from './../../src'

require('dotenv').config()

beforeAll(() => {
  nock(`https://${process.env.BSD_DEV}`)
    .get('/page/api/signup/list_form_fields')
    .query(true)
    .reply(200, (uri, requestBody, cb) => {
      fs.readFile(path.resolve(__dirname, '../fixtures/signupForms/listFormFields.xml'), cb)
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

describe('#listFormFields()', () => {
  it('should have the property "listFormFields"', () => {
    expect(blueStateDigital).toHaveProperty('listFormFields')
  })

  it('should return all fields for a form', async () => {
    const formFields = await blueStateDigital.listFormFields({ signup_form_id: '105' })
    expect(formFields).toBeDefined()
    expect(formFields).toMatchSnapshot()
  })
})
