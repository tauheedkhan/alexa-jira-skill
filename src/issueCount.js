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
