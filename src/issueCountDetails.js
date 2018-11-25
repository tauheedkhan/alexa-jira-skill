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
