const request = require('request-promise')
require('request-promise').debug = process.env.DEBUG
const responseBuilder = require('./response')
const assigneeMapper = require('./assigneeMapper')
const auth = require('./authorization')

const DOMAIN = process.env.DOMAIN

const options = (opts) => ({
  method: 'PUT',
  uri: `https://${DOMAIN}/rest/api/3/issue/${opts.projectKey}-${opts.jiraId}/assignee`,
  json: true,
  resolveWithFullResponse: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Basic ${auth}`
  },
  body: {'name': opts.assigneeId}
})

console.log('ASSIGN OPTIONS :: ', options)
const alexaResponse = (opts, session) => ({
  speechText: `Jira ticket ${opts.jiraId} has been assigned to ${opts.assigneeId}, Any thing else I can help you with ?`,
  endSession: false,
  session
})

const req = (opts, context, session) => {
  opts.assigneeId = assigneeMapper[opts.assignee]
  request(options(opts))
    .then(response => {
      session.attributes.intent = null
      context.succeed(responseBuilder(alexaResponse(opts, session)))
    })
    .catch(() => {
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
