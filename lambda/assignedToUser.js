const request = require('request-promise')
const responseBuilder = require('./response')

const options = () => ({
  method: 'GET',
  uri: `https://jira-alexa.atlassian.net/rest/api/3/search?jql=assignee=currentuser()`,
  json: true,
  resolveWithFullResponse: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Basic dGF1aGVlZGtoYW4yNjExQGdtYWlsLmNvbTpUZXRyYXRlY0Ay'
  }
})

const alexaResponse = (opts) => ({
  speechText: `There are total ${opts.total} issues assigned to you`,
  endSession: true
})

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

