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
const alexaResponse = (opts, session) => {
  const issues = opts.issues.map(item => item.key)
  session.attributes.jiraid = issues[0].split('-')[1]
  const response = {
    speechText: `Jeera ID assigned to you,  are, <say-as interpret-as="spell-out">${issues.toString()}</say-as> . Anything else I can help you with ?`,
    endSession: false,
    session}

  return response
}

const req = (opts, context, session) => {
  request(options())
    .then(response => {
      delete session.attributes.intent
      context.succeed(responseBuilder(alexaResponse(response.body, session)))
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
