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

console.log('ISSUE COUNT DETAILS OPTIONS :: ', options)
const alexaResponse = (opts) => {
  const issues = opts.issues.map(item => item.key)
  const response = {
    speechText: `Jira ID assigned to you,  are, <say-as interpret-as="spell-out">${issues.toString()}</say-as>`,
    endSession: true}

  return response
}

const req = (opts, context) => {
  request(options())
    .then(response => {
      context.succeed(responseBuilder(alexaResponse(response.body)))
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
