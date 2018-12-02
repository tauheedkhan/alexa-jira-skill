const request = require('request-promise')
require('request-promise').debug = true
const responseBuilder = require('./response')
const getTransition = require('./transitionMapper')
const auth = require('./authorization')

const DOMAIN = process.env.DOMAIN

const options = (opts) => ({
  method: 'POST',
  uri: `https://${DOMAIN}/rest/api/3/issue/${opts.projectKey}-${opts.jiraId}/transitions`,
  json: true,
  resolveWithFullResponse: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Basic ${auth}`
  },
  body: {'transition': {
    'id': opts.transition
  }}
})
console.log('CHANGE STATUS OPTIONS :: ', options)
const alexaResponse = (opts, session) => ({
  speechText: `Status of Jeera id,  ${opts.jiraId},  has been changed to ${opts.status}, Anything else I can help you with ?`,
  endSession: false,
  session
})

const req = (opts, context, session) => {
  const transition = getTransition[opts.status]
  opts.transition = transition
  request(options(opts))
    .then(response => {
      delete session.attributes.intent
      context.succeed(responseBuilder(alexaResponse(opts, session)))
    })
    .catch(() => {
      session.attributes.intent = 'ChangeStatus'
      const text = `There was a problem, can you repeat jira id please ?`
      const alexaRes = {
        speechText: text,
        endSession: false,
        session
      }
      context.succeed(responseBuilder(alexaRes))
    })
}

module.exports = {
  options,
  alexaResponse,
  req
}
