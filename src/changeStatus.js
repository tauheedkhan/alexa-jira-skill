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
const alexaResponse = (opts) => ({
  speechText: `Status of Jira id,  ${opts.jiraId},  has been changed to ${opts.status}`,
  endSession: true
})

const req = (opts, context) => {
  const transition = getTransition[opts.status.toLowerCase()]
  opts.transition = transition
  request(options(opts))
    .then(response => {
      context.succeed(responseBuilder(alexaResponse(opts)))
    })
    .catch(err => {
      context.fail(`Some error occured : ${err}`)
    })
}

module.exports = {
  options,
  alexaResponse,
  req
}
