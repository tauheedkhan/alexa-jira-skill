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
const alexaResponse = (opts) => ({
  speechText: `Jira ticket ${opts.jiraId} has been assigned to ${opts.assigneeId}`,
  endSession: true
})

const req = (opts, context) => {
  opts.assigneeId = assigneeMapper[opts.assignee.toLowerCase()]
  request(options(opts))
    .then(response => {
      context.succeed(responseBuilder(alexaResponse(opts)))
    })
    .catch(err => {
      const alexaRes = {
        speechText: err.errors.assignee,
        endSession: false
      }
      context.succeed(responseBuilder(alexaRes))
    })
}

module.exports = {
  options,
  alexaResponse,
  req
}
