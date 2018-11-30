const request = require('request-promise')
require('request-promise').debug = true
const responseBuilder = require('./response')
const auth = require('./authorization')

const DOMAIN = process.env.DOMAIN

const options = () => ({
  method: 'GET',
  uri: `https://${DOMAIN}/rest/api/3/search?jql=assignee=currentuser()`,
  json: true,
  resolveWithFullResponse: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Basic ${auth}`
  }
})

console.log('ISSUE COUNT OPTIONS :: ', options)
const alexaResponse = (opts, alexaOptions) => {
  if (opts.total === 0) {
    const res = {
      speechText: `There are no issues assigned to you`,
      endSession: true
    }
    return res
  }

  alexaOptions.speechText = `There are total ${opts.total} issues assigned to you. Do you want to know the issue id`
  return alexaOptions
}

const req = (opts, alexaOptions, context) => {
  request(options())
    .then(response => {
      context.succeed(responseBuilder(alexaResponse(response.body, alexaOptions)))
    })
    .catch(err => {
      const alexaRes = {
        speechText: err.errors.assignee,
        endSession: true
      }
      context.fail(responseBuilder(alexaRes))
    })
}

module.exports = {
  req
}
