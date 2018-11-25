const request = require('request-promise')
const responseBuilder = require('./response')
const assigneeMapper = require('./assigneeMapper')

const options = (opts) => ({
  method: 'PUT',
  uri: `https://jira-alexa.atlassian.net/rest/api/3/issue/${opts.projectKey}-${opts.jiraId}/assignee`,
  json: true,
  resolveWithFullResponse: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Basic dGF1aGVlZGtoYW4yNjExQGdtYWlsLmNvbTpUZXRyYXRlY0Ay'
  },
  body: {'name': opts.assigneeId}
})

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
        endSession: true
      }
      context.fail(responseBuilder(alexaRes))
    })
}

module.exports = {
  options,
  alexaResponse,
  req
}
