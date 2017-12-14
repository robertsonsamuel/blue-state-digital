import BSD from './../../src'

require('dotenv').config()

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
