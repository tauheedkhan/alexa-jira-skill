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
const alexaResponse = (body, session) => {
  if (body.total === 0) {
    const res = {
      speechText: `There are no issues assigned to you. Can I help you with any thing else ?`,
      endSession: false
    }
    return res
  }
  const response = {
    speechText: `There are total ${body.total} issues assigned to you. Do you want to know the jeera id`,
    endSession: false,
    session
  }
  return response
}

const req = (context, session) => {
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
